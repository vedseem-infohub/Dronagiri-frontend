"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("dronagiri_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error parsing cart data", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("dronagiri_cart", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (product, variantSize, quantity = 1) => {
    const variant = product.variants.find((v) => v.size === variantSize) || product.variants[0];
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.size === variantSize
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        return [
          ...prevCart,
          {
            product,
            size: variantSize,
            price: variant.price,
            quantity,
          },
        ];
      }
    });
  };

  const removeFromCart = (productId, variantSize) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.product.id === productId && item.size === variantSize))
    );
  };

  const updateQuantity = (productId, variantSize, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, variantSize);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId && item.size === variantSize
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoaded,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
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
