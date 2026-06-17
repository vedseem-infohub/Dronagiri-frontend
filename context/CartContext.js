"use client";

import axios from "axios";
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { products as staticProducts } from "@/app/data/products";
import { userDataContext } from "@/context/UserContext";

const CartContext = createContext();

function normalizeCartItems(items = [], allProducts = []) {
  return items.map((item) => {
    const localProduct = allProducts.find(
      (product) => product.id === item.productId
    );

    return {
      product: localProduct || {
        id: item.productId,
        name: item.name,
        category: "",
        variants: [{ quantity: item.quantity, price: item.price }],
        imageUrl: item.imageUrl || "",
      },
      quantity: item.quantity,
      price: item.price,
      count: item.count,
    };
  });
}

function normalizeOrders(ordersList = [], allProducts = []) {
  return ordersList.map((order) => {
    const normalizedItems = (order.items || []).map((item) => {
      const localProduct = allProducts.find(
        (product) => product.id === item.productId
      );

      return {
        product: localProduct || {
          id: item.productId,
          name: item.name,
          nameHindi: "",
          category: "",
          variants: [{ quantity: item.quantity, price: item.price }],
          imageUrl: item.imageUrl || "",
        },
        quantity: item.quantity,
        price: item.price,
        count: item.count,
      };
    });

    return {
      ...order,
      items: normalizedItems,
    };
  });
}

export function CartProvider({ children, initialCart, initialOrders }) {
  const { serverUrl, isLoggedIn, loding } = useContext(userDataContext);
  const didHydrateRef = useRef(initialCart !== undefined && initialOrders !== undefined);

  const [dbProducts, setDbProducts] = useState(staticProducts);

  const [cart, setCart] = useState(() => {
    if (initialCart !== undefined) {
      return normalizeCartItems(initialCart?.items || [], staticProducts);
    }
    return [];
  });

  const [orders, setOrders] = useState(() => {
    if (initialOrders !== undefined) {
      return normalizeOrders(initialOrders || [], staticProducts);
    }
    if (typeof window === "undefined") return [];

    const savedOrders = localStorage.getItem("dronagiri_orders");
    if (!savedOrders) return [];

    try {
      return normalizeOrders(JSON.parse(savedOrders), staticProducts);
    } catch (error) {
      console.error("Error parsing order data", error);
      return [];
    }
  });

  const [isLoaded, setIsLoaded] = useState(
    initialCart !== undefined && initialOrders !== undefined ? true : false
  );

  const fetchDbProducts = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/products`);
      if (result.data) {
        setDbProducts(result.data);
        
        // Re-normalize cart with fresh products
        setCart((prevCart) => {
          const rawItems = prevCart.map(item => ({
            productId: item.product.id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.price,
            count: item.count
          }));
          return normalizeCartItems(rawItems, result.data);
        });

        // Re-normalize orders with fresh products
        setOrders((prevOrders) => {
          const rawOrders = prevOrders.map(order => ({
            ...order,
            items: order.items.map(item => ({
              productId: item.product.id,
              name: item.product.name,
              quantity: item.quantity,
              price: item.price,
              count: item.count
            }))
          }));
          return normalizeOrders(rawOrders, result.data);
        });
      }
    } catch (error) {
      console.error("Error fetching db products:", error);
    }
  };

  useEffect(() => {
    fetchDbProducts();
  }, [serverUrl]);

  const applyBackendCart = (backendCart, currentProducts = dbProducts) => {
    setCart(normalizeCartItems(backendCart?.items, currentProducts));
  };

  const fetchCart = async () => {
    if (!isLoggedIn) {
      setCart([]);
      setIsLoaded(true);
      return;
    }

    setIsLoaded(false);
    try {
      const result = await axios.get(`${serverUrl}/api/cart`, {
        withCredentials: true,
      });
      applyBackendCart(result.data);
    } catch (error) {
      console.error("Error loading cart", error);
      setCart([]);
    } finally {
      setIsLoaded(true);
    }
  };

  const fetchOrders = async () => {
    if (!isLoggedIn) {
      setOrders([]);
      return;
    }

    try {
      const result = await axios.get(`${serverUrl}/api/orders`, {
        withCredentials: true,
      });
      setOrders(normalizeOrders(result.data, dbProducts));
    } catch (error) {
      console.error("Error loading orders", error);
      setOrders([]);
    }
  };

  useEffect(() => {
    if (loding) return;

    if (didHydrateRef.current) {
      didHydrateRef.current = false;
      return;
    }

    let isMounted = true;

    const loadCartAndOrders = async () => {
      if (!isLoggedIn) {
        if (isMounted) {
          setCart([]);
          setOrders([]);
          setIsLoaded(true);
        }
        return;
      }

      if (isMounted) setIsLoaded(false);

      try {
        const [cartRes, ordersRes] = await Promise.all([
          axios.get(`${serverUrl}/api/cart`, { withCredentials: true }),
          axios.get(`${serverUrl}/api/orders`, { withCredentials: true })
        ]);
        if (isMounted) {
          applyBackendCart(cartRes.data);
          setOrders(normalizeOrders(ordersRes.data));
        }
      } catch (error) {
        console.error("Error loading cart or orders", error);
        if (isMounted) {
          setCart([]);
          setOrders([]);
        }
      } finally {
        if (isMounted) setIsLoaded(true);
      }
    };

    const timeoutId = window.setTimeout(loadCartAndOrders, 0);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [isLoggedIn, loding, serverUrl]);

  useEffect(() => {
    localStorage.setItem("dronagiri_orders", JSON.stringify(orders));
  }, [orders]);

  const addToCart = async (product, variantQuantity, count = 1) => {
    const variant =
      product.variants.find((v) => v.quantity === variantQuantity) ||
      product.variants[0];

    const result = await axios.post(
      `${serverUrl}/api/cart/add`,
      {
        productId: product.id,
        name: product.name,
        quantity: variantQuantity,
        price: variant.price,
        imageUrl: product.imageUrl || "",
        count,
      },
      { withCredentials: true }
    );

    applyBackendCart(result.data);
    return result.data;
  };

  const removeFromCart = async (productId, variantQuantity) => {
    const result = await axios.delete(`${serverUrl}/api/cart/remove`, {
      withCredentials: true,
      data: {
        productId,
        quantity: variantQuantity,
      },
    });

    applyBackendCart(result.data);
    return result.data;
  };

  const updateQuantity = async (productId, variantQuantity, newCount) => {
    const result = await axios.put(
      `${serverUrl}/api/cart/update`,
      {
        productId,
        quantity: variantQuantity,
        count: newCount,
      },
      { withCredentials: true }
    );

    applyBackendCart(result.data);
    return result.data;
  };

  const clearCart = async () => {
    const result = await axios.delete(`${serverUrl}/api/cart/clear`, {
      withCredentials: true,
    });

    applyBackendCart(result.data);
    return result.data;
  };

  const addOrder = async (orderData) => {
    if (!isLoggedIn) {
      const offlineOrder = {
        ...orderData,
        createdAt: orderData.createdAt || new Date().toISOString(),
      };
      setOrders((prevOrders) => [offlineOrder, ...prevOrders]);
      return offlineOrder;
    }

    try {
      const result = await axios.post(`${serverUrl}/api/orders`, orderData, {
        withCredentials: true,
      });
      const [normalized] = normalizeOrders([result.data]);
      setOrders((prevOrders) => [normalized, ...prevOrders]);
      return normalized;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  const clearOrders = () => {
    setOrders([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.count, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.count, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        orders,
        isLoaded,
        products: dbProducts,
        fetchCart,
        fetchOrders,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addOrder,
        clearOrders,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
