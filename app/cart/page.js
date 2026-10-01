"use client";

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  CheckCircle,
  Gift,
  Truck,
  ShoppingBag,
  CreditCard,
  Check,
  Tag,
  Ticket,
  Loader2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductIcon from "../components/ProductIcon";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { userDataContext } from "@/context/UserContext";
import axios from "axios";
import { useShipping } from "@/hooks/useShipping";

export default function CartPage() {
  const {
    cart,
    isLoaded,
    updateQuantity,
    removeFromCart,
    clearCart,
    addOrder,
    getCartTotal
  } = useCart();

  const { userData: user, serverUrl, setuserData } = useContext(userDataContext);

  // Local UI State
  const [promoCode, setPromoCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null); // full coupon object with discount info
  const [promoError, setPromoError] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);

  // Checkout Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    landmark: "",
    pincode: "",
    instructions: "",
    paymentMethod: "cod" // 'cod' or 'bank'
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [completedOrderDetails, setCompletedOrderDetails] = useState(null);

  // Delhivery shipping integration via useShipping hook
  const {
    checkPincode,
    calculateCost,
    serviceability,
    shippingRate,
    loading: shippingLoading,
    costLoading,
    error: shippingHookError,
    resetShipping,
  } = useShipping({ serverUrl });

  // Pre-fill user details (address, name, email, phone) if user is logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
        address: prev.address || user.address || "",
        landmark: prev.landmark || user.landmark || "",
        pincode: prev.pincode || user.pincode || "",
      }));
    }
  }, [user]);

  // Pricing calculations: base subtotal
  const subtotal = getCartTotal();

  // Calculate total cart weight (in grams) for accurate Delhivery logistics calculation
  const totalCartWeight = cart.reduce((acc, item) => {
    const q = String(item.quantity || "").toLowerCase();
    let unitWeight = 500;
    if (q.includes("kg")) {
      const parsed = parseFloat(q);
      unitWeight = isNaN(parsed) ? 1000 : parsed * 1000;
    } else if (q.includes("g") || q.includes("gm")) {
      const parsed = parseFloat(q);
      unitWeight = isNaN(parsed) ? 500 : parsed;
    }
    return acc + unitWeight * (item.count || 1);
  }, 0);

  // Trigger Delhivery pincode check and rate calculation on pincode change / blur
  const triggerPincodeCheck = async (pinValue) => {
    const cleanPin = String(pinValue || "").trim().replace(/\D/g, "");
    if (cleanPin.length !== 6) return;

    const res = await checkPincode(cleanPin);
    if (res.success && res.data?.serviceable) {
      // Auto-switch to online if COD is unavailable
      if (!res.data.codAvailable && formData.paymentMethod === "cod") {
        setFormData((prev) => ({ ...prev, paymentMethod: "online" }));
        toast.info("Cash on Delivery (COD) is not available for this pincode. Switched to Online Payment.");
      }

      // Calculate live shipping cost based on cart weight & order amount
      await calculateCost({
        destPincode: cleanPin,
        weight: totalCartWeight,
        paymentType: formData.paymentMethod === "cod" ? "COD" : "Prepaid",
        orderAmount: subtotal,
      });
    }
  };

  // Debounced auto-check when 6 digits are entered
  useEffect(() => {
    const cleanPin = String(formData.pincode || "").trim().replace(/\D/g, "");
    if (cleanPin.length === 6) {
      const timer = setTimeout(() => {
        triggerPincodeCheck(cleanPin);
      }, 400);
      return () => clearTimeout(timer);
    } else {
      if (shippingRate || serviceability.checked) {
        resetShipping();
      }
    }
  }, [formData.pincode, totalCartWeight, formData.paymentMethod, subtotal]);

  // Scroll to top on mount and load Razorpay script
  useEffect(() => {
    window.scrollTo(0, 0);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch active promo offers from backend for customer discovery
  useEffect(() => {
    const fetchActiveCoupons = async () => {
      if (!serverUrl) return;
      try {
        const res = await axios.get(`${serverUrl}/api/coupons/active`);
        if (res.data?.success && Array.isArray(res.data.data)) {
          setAvailableCoupons(res.data.data);
        }
      } catch (e) {
        // silent fail for non-critical promo banner
      }
    };
    fetchActiveCoupons();
  }, [serverUrl]);

  // Live Delhivery rate (always calculated by Delhivery based on destination pincode, weight & payment method)
  const hasShippingRate = Boolean(shippingRate && !costLoading);
  const shippingCost = hasShippingRate ? Number(shippingRate.totalAmount || 0) : 0;

  // Calculate discount based on admin-defined coupon
  let discountAmount = 0;
  if (appliedCoupon && subtotal > 0) {
    if (appliedCoupon.discountType === "percentage") {
      discountAmount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maxDiscountAmount && discountAmount > appliedCoupon.maxDiscountAmount) {
        discountAmount = appliedCoupon.maxDiscountAmount;
      }
    } else {
      // Flat discount
      discountAmount = Math.min(appliedCoupon.discountValue, subtotal);
    }
  }

  // Grand Total rounded off to whole rupees
  const finalTotal = Math.round(Math.max(0, subtotal - discountAmount + (hasShippingRate ? shippingCost : 0)));

  // Live Coupon Validation via Backend
  const handleApplyPromo = async (e, customCode) => {
    if (e && e.preventDefault) e.preventDefault();
    const codeToApply = (customCode || promoCode).trim().toUpperCase();

    if (!codeToApply) {
      setPromoError("Please enter a coupon code");
      return;
    }

    if (subtotal <= 0) {
      setPromoError("Add items to your basket before applying a coupon");
      return;
    }

    setIsApplyingPromo(true);
    setPromoError("");

    try {
      const res = await axios.post(`${serverUrl}/api/coupons/validate`, {
        code: codeToApply,
        subtotal,
      });

      if (res.data?.valid) {
        const { coupon, discountAmount: discAmt, discountDisplay, message } = res.data;
        setAppliedCoupon({
          ...coupon,
          discountAmount: discAmt,
          discountDisplay,
        });
        setPromoCode(coupon.code);
        setPromoError("");
        toast.success(message || `Coupon "${coupon.code}" applied!`);
      } else {
        setPromoError(res.data?.message || "Invalid coupon code");
      }
    } catch (err) {
      const errMsg = err?.response?.data?.message || "Invalid or expired coupon code";
      setPromoError(errMsg);
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedCoupon(null);
    setPromoCode("");
    setPromoError("");
    toast.info("Coupon removed");
  };

  // Re-verify minimum order amount when basket changes
  useEffect(() => {
    if (appliedCoupon && appliedCoupon.minOrderAmount > 0 && subtotal < appliedCoupon.minOrderAmount) {
      toast.warning(
        `Coupon "${appliedCoupon.code}" requires minimum order of ₹${appliedCoupon.minOrderAmount}. Removed from basket.`
      );
      setAppliedCoupon(null);
    }
  }, [subtotal, appliedCoupon]);

  // Form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Basic Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Full Name is required";
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.trim().replace(/\D/g, ""))) {
      errors.phone = "Please enter a valid 10-digit mobile number";
    }
    if (!formData.address.trim()) errors.address = "Delivery address is required";
    if (!formData.pincode.trim()) {
      errors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      errors.pincode = "Pincode must be 6 digits";
    } else if (serviceability.checked && serviceability.serviceable === false) {
      errors.pincode = "This pincode is not serviceable by Delhivery";
    } else if (!hasShippingRate) {
      errors.pincode = "Please enter a valid serviceable pincode to calculate Delhivery shipping";
    }

    if (formData.paymentMethod === "cod" && serviceability.checked && serviceability.codAvailable === false) {
      errors.paymentMethod = "COD is not available for this pincode. Please choose Online Payment.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit order to admin queue
  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      toast.error("Please fill in the required delivery fields.");
      return;
    }

    setIsSubmitting(true);
    const orderNumber = "DF-" + Math.floor(100000 + Math.random() * 900000);
    const deliveryAddress = `${formData.address}, ${formData.landmark ? formData.landmark + ", " : ""}${formData.pincode}`;

    // Update user profile address in background if user is logged in
    if (user) {
      try {
        const res = await axios.put(
          `${serverUrl}/api/user/address`,
          {
            phone: formData.phone.trim(),
            address: formData.address.trim(),
            landmark: formData.landmark.trim(),
            pincode: formData.pincode.trim(),
          },
          { withCredentials: true }
        );
        setuserData(res.data);
      } catch (err) {
        console.error("Failed to update profile address on checkout:", err);
      }
    }

    try {
      // Map items to match the order model expectations (flat schema per item)
      const orderItems = cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        imageUrl: item.product.imageUrl || "",
        count: item.count
      }));

      const orderDetails = {
        orderId: orderNumber,
        customer: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: deliveryAddress,
        },
        items: orderItems,
        subtotal,
        discountAmount,
        promoCode: appliedCoupon?.code || "",
        shippingCost,
        total: finalTotal,
        paymentMethod: formData.paymentMethod,
        source: "admin",
      };

      if (formData.paymentMethod === "online") {
        try {
          const { data: { orderId: rzpOrderId, amount, currency, keyId } } = await axios.post(
            `${serverUrl}/api/payments/create-order`,
            { amount: finalTotal },
            { withCredentials: true }
          );

          const options = {
            key: keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY,
            amount: amount,
            currency: currency,
            name: "Dronagiri Farms",
            description: "Fresh Organic Products",
            order_id: rzpOrderId,
            handler: async function (response) {
              try {
                const verifyRes = await axios.post(
                  `${serverUrl}/api/payments/verify`,
                  {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    orderDetails: orderDetails,
                  },
                  { withCredentials: true }
                );
                
                const waybillNumber =
                  verifyRes?.data?.order?.waybill ||
                  verifyRes?.data?.waybill ||
                  "DF" + Math.floor(100000000 + Math.random() * 900000000);

                setCompletedOrderDetails({
                  orderId: orderNumber,
                  name: formData.name,
                  phone: formData.phone,
                  address: deliveryAddress,
                  total: finalTotal,
                  waybill: waybillNumber,
                });
          
                setOrderComplete(true);
                toast.success("Payment successful and order placed!");
                await clearCart();
              } catch (verifyError) {
                toast.error(verifyError?.response?.data?.message || "Payment verification failed.");
              } finally {
                setIsSubmitting(false);
              }
            },
            prefill: {
              name: formData.name,
              email: formData.email,
              contact: formData.phone,
            },
            theme: {
              color: "#8C6A43",
            },
            modal: {
              ondismiss: function () {
                setIsSubmitting(false);
                toast.error("Payment cancelled.");
              }
            }
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        } catch (error) {
          setIsSubmitting(false);
          toast.error(error?.response?.data?.message || "Failed to initialize payment.");
        }
        return; // Early return for online flow
      }

      // COD Flow
      const createdOrder = await addOrder(orderDetails);
      const waybillNumber =
        createdOrder?.waybill ||
        createdOrder?.shipping?.waybill ||
        "DF" + Math.floor(100000000 + Math.random() * 900000000);

      setCompletedOrderDetails({
        orderId: orderNumber,
        name: formData.name,
        phone: formData.phone,
        address: deliveryAddress,
        total: finalTotal,
        waybill: waybillNumber,
      });

      setOrderComplete(true);
      toast.success("Order placed successfully!");
      await clearCart();
    } catch (error) {
      console.error("Failed to place order:", error);
      toast.error(error?.response?.data?.message || "Failed to place order. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center min-h-[60vh] bg-[#fdfbf7]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-[#8C6A43] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">Harvesting your cart details...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Render Order Confirmation Screen
  if (orderComplete && completedOrderDetails) {
    return (
      <>
        <Navbar />
        <main className="flex-1 bg-[#fdfbf7] py-20 px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100 text-center animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#223614]/10 text-[#223614] mb-6 shadow-inner animate-bounce">
              <Check className="h-10 w-10 stroke-[3]" />
            </div>

            <h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
              Your order has been placed and registered for Delhivery fulfillment.
              You can track your live shipment stage anytime.
            </p>

            <div className="bg-gray-50 rounded-2xl p-6 text-left mb-8 border border-gray-100 divide-y divide-gray-200/60">
              <div className="py-3 flex justify-between gap-4">
                <span className="text-gray-400 text-sm font-medium">Order Number:</span>
                <span className="text-gray-800 font-bold tracking-wide">{completedOrderDetails.orderId}</span>
              </div>
              <div className="py-3 flex justify-between items-center gap-4">
                <span className="text-gray-400 text-sm font-medium">Waybill (AWB):</span>
                <span className="font-mono text-sm font-bold bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 rounded-xl">
                  {completedOrderDetails.waybill}
                </span>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <span className="text-gray-400 text-sm font-medium">Recipient Name:</span>
                <span className="text-gray-800 font-semibold">{completedOrderDetails.name}</span>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <span className="text-gray-400 text-sm font-medium">Phone Number:</span>
                <span className="text-gray-800 font-semibold">{completedOrderDetails.phone}</span>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <span className="text-gray-400 text-sm font-medium">Delivery Address:</span>
                <span className="text-gray-800 text-sm text-right font-medium max-w-[280px] break-words">{completedOrderDetails.address}</span>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <span className="text-gray-400 text-sm font-medium">Total Price:</span>
                <span className="text-[#223614] font-bold text-lg">₹{completedOrderDetails.total}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/orders/${completedOrderDetails.orderId}/track?waybill=${completedOrderDetails.waybill || ""}`}
                className="inline-flex items-center justify-center gap-2 flex-1 bg-gradient-to-r from-[#203515] to-[#8C6A43] hover:from-[#172710] hover:to-[#735534] text-white font-semibold py-3.5 px-6 rounded-2xl shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                <Truck className="h-5 w-5" />
                Track Your Order
              </Link>
              <Link
                href="/orders"
                className="inline-flex items-center justify-center gap-2 sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3.5 px-6 rounded-2xl transition-all"
              >
                <CheckCircle className="h-5 w-5 text-gray-500" />
                View All Orders
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Thinner Hero Header */}
      <section className="relative pt-32 pb-16 bg-[#203515] overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-4 animate-fade-in-up">
            <ShoppingCart className="h-4 w-4 text-amber-400" />
            <span className="text-white/90 text-xs font-semibold tracking-widest uppercase">
              Fresh Harvest Basket
            </span>
          </div>
          <h1 className="font-[family-name:var(--font-playfair)] text-white text-4xl sm:text-5xl font-bold mb-2 animate-fade-in-up">
            Shopping Cart
          </h1>
          <p className="text-white/60 text-sm sm:text-base font-light max-w-md mx-auto animate-fade-in-up">
            Review your farm-fresh selection and proceed to secure checkout.
          </p>
        </div>
      </section>

      <main className="flex-1 bg-[#fdfbf7] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {cart.length === 0 ? (
            /* Premium Empty Cart State */
            <div className="max-w-md mx-auto text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-lg px-6 animate-fade-in-up">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#8C6A43]/15 text-[#8C6A43] mb-6 shadow-inner animate-pulse">
                <ShoppingCart className="h-10 w-10" />
              </div>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-gray-900 mb-3">
                Your Basket is Empty
              </h2>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                You haven&apos;t added any fresh staples yet! Our organic harvests are grown with care, waiting to grace your healthy table.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#8C6A43] to-amber-600 hover:from-amber-600 hover:to-[#8C6A43] text-white font-semibold px-8 py-3.5 rounded-2xl shadow-md hover:shadow-[#8C6A43]/30 transition-all duration-200 hover:-translate-y-0.5"
              >
                <ArrowLeft className="h-5 w-5" />
                Explore Our Grains &amp; Spices
              </Link>
            </div>
          ) : (
            /* Multi-column Cart & Checkout Layout */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

              {/* Left Column: Cart items list */}
              <div className="lg:col-span-7 flex flex-col gap-6">

                {/* Header Actions */}
                <div className="flex items-center justify-between border-b border-gray-200/60 pb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    Cart Items ({cart.reduce((c, i) => c + i.count, 0)})
                  </h2>
                  <button
                    onClick={clearCart}
                    className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear Basket
                  </button>
                </div>

                {/* Items List */}
                <div className="flex flex-col gap-4">
                  {cart.map((item) => (
                    <div
                      key={`${item.product.id}-${item.quantity}`}
                      className="bg-white rounded-3xl p-5 border border-[#8C6A43]/10 shadow-sm flex flex-col sm:flex-row sm:items-center gap-5 transition-all duration-300 hover:shadow-md hover:border-[#8C6A43]/40"
                    >
                      {/* Product Visual */}
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-br from-[#F7F1E8] via-[#fdfbf7] to-amber-50/50 flex items-center justify-center text-[#223614] shrink-0 shadow-inner">
                        <ProductIcon product={item.product} className="h-10 w-10 sm:h-12 sm:w-12" />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-[family-name:var(--font-playfair)] text-gray-900 font-bold text-lg leading-tight">
                              {item.product.name}
                            </h3>
                            <p className="text-amber-600 text-xs font-semibold mt-0.5">
                              {item.product.nameHindi}
                            </p>
                          </div>

                          {/* Unit price for desktop */}
                          <span className="text-sm font-semibold text-gray-400 hidden sm:inline">
                            ₹{item.price} / {item.quantity}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity control */}
                          <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50/50 p-1">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity, item.count - 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white hover:text-[#8C6A43] text-gray-400 hover:shadow-sm transition-all duration-200"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold text-gray-700">
                              {item.count}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity, item.count + 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white hover:text-[#8C6A43] text-gray-400 hover:shadow-sm transition-all duration-200"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* Total and Delete */}
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <span className="text-lg font-bold text-[#223614] block">
                                ₹{item.price * item.count}
                              </span>
                              <span className="text-[10px] text-gray-400 sm:hidden">
                                ₹{item.price} / {item.quantity}
                              </span>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.product.id, item.quantity)}
                              className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-105"
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Back to Shopping Button */}
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-[#8C6A43] hover:text-amber-750 font-semibold mt-2 transition-all duration-200 group self-start"
                >
                  <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Add more farm-fresh staples
                </Link>
              </div>

              {/* Right Column: Calculations & Checkout Form */}
              <div className="lg:col-span-5 flex flex-col gap-6">

                {/* 1. Cost Calculations Summary */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md">
                  <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">
                    Order Summary
                  </h3>

                  <div className="flex flex-col gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Basket Subtotal</span>
                      <span className="text-gray-800 font-bold">₹{subtotal}</span>
                    </div>

                    {/* Promo Section */}
                    {appliedCoupon ? (
                      <div className="flex flex-col gap-1.5 bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50/50 border border-emerald-200/80 rounded-2xl p-3.5 shadow-sm animate-fadeInUp">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                              <Ticket className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-black text-emerald-900 tracking-wider text-xs">
                                  {appliedCoupon.code}
                                </span>
                                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  {appliedCoupon.discountType === "percentage"
                                    ? `${appliedCoupon.discountValue}% OFF`
                                    : `₹${appliedCoupon.discountValue} FLAT OFF`}
                                </span>
                              </div>
                              <span className="text-[11px] text-emerald-700 font-medium block mt-0.5">
                                {appliedCoupon.description || "Special promotional offer applied"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-right">
                            <div>
                              <span className="font-black text-sm text-emerald-700 block">
                                -₹{discountAmount.toLocaleString("en-IN")}
                              </span>
                              <button
                                type="button"
                                onClick={handleRemovePromo}
                                className="text-[10px] font-bold text-red-500 hover:text-red-700 underline cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>

                        {appliedCoupon.discountType === "percentage" && appliedCoupon.maxDiscountAmount && (
                          <div className="text-[10px] text-emerald-600/80 border-t border-emerald-200/50 pt-1 mt-1">
                            ℹ️ Maximum discount capped at ₹{appliedCoupon.maxDiscountAmount.toLocaleString("en-IN")}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2 my-1.5">
                        <form onSubmit={handleApplyPromo} className="flex gap-2">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              placeholder="ENTER COUPON CODE"
                              value={promoCode}
                              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                              className="w-full border border-gray-200 rounded-xl pl-8 pr-3 py-2 text-xs uppercase font-mono font-semibold focus:outline-none focus:border-green-600 bg-gray-50/60 text-gray-800 placeholder:normal-case placeholder:font-sans placeholder:text-gray-400 transition-all"
                            />
                            <Tag className="h-3.5 w-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                          </div>
                          <button
                            type="submit"
                            disabled={isApplyingPromo}
                            className="bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow"
                          >
                            {isApplyingPromo ? (
                              <>
                                <Loader2 className="h-3 w-3 animate-spin" />
                                <span>Applying...</span>
                              </>
                            ) : (
                              <span>Apply</span>
                            )}
                          </button>
                        </form>

                        {/* Available Coupons list */}
                        {availableCoupons.length > 0 && (
                          <div className="flex flex-col gap-1.5 pt-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                              <Gift className="h-3 w-3 text-amber-600" />
                              Available Store Coupons
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {availableCoupons.map((c) => (
                                <button
                                  key={c.code}
                                  type="button"
                                  onClick={(e) => handleApplyPromo(e, c.code)}
                                  className="text-[11px] bg-amber-50/80 hover:bg-amber-100/90 text-amber-900 border border-amber-200/70 hover:border-amber-300 px-2.5 py-1 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer group"
                                  title={c.description || `${c.code} discount`}
                                >
                                  <span className="font-mono font-bold group-hover:text-amber-950">
                                    {c.code}
                                  </span>
                                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-200/60 px-1.5 py-0.2 rounded-md">
                                    {c.discountType === "percentage" ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {promoError && (
                      <p className="text-[10px] font-bold text-red-500 mt-0.5 flex items-center gap-1">
                        <span>⚠️</span>
                        <span>{promoError}</span>
                      </p>
                    )}

                    {/* Shipping Costs */}
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-400 flex items-center gap-1">
                        <Truck className="h-4 w-4 text-gray-300" />
                        Delivery Shipping (Delhivery)
                      </span>
                      {costLoading ? (
                        <span className="inline-block h-4 w-12 bg-gray-200 animate-pulse rounded-md" />
                      ) : hasShippingRate ? (
                        <div className="text-right">
                          <span className="text-gray-800 font-bold">₹{shippingCost}</span>
                          {shippingRate?.codCharges > 0 && formData.paymentMethod === "cod" && (
                            <span className="text-[10px] text-gray-400 block font-normal">
                              (Base: ₹{shippingRate.baseCharge} + COD: ₹{shippingRate.codCharges})
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-md font-medium border border-amber-200/50">
                          Enter pincode to calculate
                        </span>
                      )}
                    </div>

                    <div className="border-t border-gray-100 pt-4 mt-2 flex justify-between items-end">
                      <span className="text-gray-600 font-semibold text-base">Grand Total</span>
                      <div className="text-right">
                        {costLoading ? (
                          <div className="h-7 w-20 bg-gray-200 animate-pulse rounded-md ml-auto mb-1" />
                        ) : (
                          <span className="text-2xl font-black text-[#223614] block">
                            ₹{finalTotal}
                          </span>
                        )}
                        <span className="text-[10px] text-gray-400 block font-medium">
                          {hasShippingRate ? "inclusive of delivery & taxes" : "delivery calculated on pincode"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Glassmorphic Checkout Form */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md flex flex-col gap-5">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-1">
                      Delivery Details
                    </h3>
                    <p className="text-[11px] text-gray-400 leading-normal">
                      We source directly. Enter your active delivery address below.
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 text-sm">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Yash Kumar"
                        className={`border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#8C6A43] bg-gray-50/20 text-gray-700 ${formErrors.name ? "border-red-400 focus:ring-red-400" : "border-gray-200"
                          }`}
                      />
                      {formErrors.name && (
                        <span className="text-[10px] font-bold text-red-500">{formErrors.name}</span>
                      )}
                    </div>

                    {/* Contact Elements */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Phone */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Mobile No <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="9876543210"
                          maxLength="10"
                          className={`border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#8C6A43] bg-gray-50/20 text-gray-700 ${formErrors.phone ? "border-red-400 focus:ring-red-400" : "border-gray-200"
                            }`}
                        />
                        {formErrors.phone && (
                          <span className="text-[10px] font-bold text-red-500">{formErrors.phone}</span>
                        )}
                      </div>

                      {/* Email */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="yash@gmail.com"
                          className="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#8C6A43] bg-gray-50/20 text-gray-700"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Delivery Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="address"
                        rows="3"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="House No, Apartment Name, Street Area"
                        className={`border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#8C6A43] bg-gray-50/20 text-gray-700 resize-none leading-relaxed ${formErrors.address ? "border-red-400 focus:ring-red-400" : "border-gray-200"
                          }`}
                      />
                      {formErrors.address && (
                        <span className="text-[10px] font-bold text-red-500">{formErrors.address}</span>
                      )}
                    </div>

                    {/* Address Elements */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Landmark */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Nearby Landmark
                        </label>
                        <input
                          type="text"
                          name="landmark"
                          value={formData.landmark}
                          onChange={handleInputChange}
                          placeholder="Opposite Central Park"
                          className="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#8C6A43] bg-gray-50/20 text-gray-700"
                        />
                      </div>

                      {/* Pincode */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                          <span>Delivery Pincode <span className="text-red-500">*</span></span>
                          {shippingLoading && (
                            <span className="text-[10px] text-amber-700 font-normal flex items-center gap-1">
                              <span className="w-2.5 h-2.5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin inline-block" />
                              Verifying Delhivery...
                            </span>
                          )}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="pincode"
                            maxLength="6"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            onBlur={(e) => triggerPincodeCheck(e.target.value)}
                            placeholder="e.g. 110001"
                            className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#8C6A43] bg-gray-50/20 text-gray-700 font-medium ${
                              formErrors.pincode
                                ? "border-red-400 focus:ring-red-400"
                                : serviceability.checked && serviceability.serviceable
                                ? "border-emerald-400 focus:ring-emerald-500"
                                : serviceability.checked && serviceability.serviceable === false
                                ? "border-red-400 focus:ring-red-400"
                                : "border-gray-200"
                            }`}
                          />
                          {shippingLoading && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <div className="w-4 h-4 border-2 border-[#8C6A43] border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}
                        </div>
                        {formErrors.pincode && (
                          <span className="text-[10px] font-bold text-red-500">{formErrors.pincode}</span>
                        )}

                        {/* Delhivery Live Serviceability Badge */}
                        {serviceability.checked && (
                          <div
                            className={`mt-1 text-[11px] rounded-xl p-2.5 flex items-start gap-2 border transition-all duration-300 animate-fadeIn ${
                              serviceability.serviceable
                                ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                                : "bg-red-50 border-red-200 text-red-700"
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {serviceability.serviceable ? (
                                <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-black">
                                  ✓
                                </div>
                              ) : (
                                <div className="w-3.5 h-3.5 rounded-full bg-red-500 text-white flex items-center justify-center text-[9px] font-black">
                                  ✕
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold leading-tight">
                                {serviceability.serviceable
                                  ? `${serviceability.city ? serviceability.city + (serviceability.state ? ", " + serviceability.state : "") : "Serviceable"} — Delhivery Express`
                                  : "Pincode Not Serviceable"}
                              </p>
                              <p className="text-[10px] text-gray-600 mt-0.5 leading-snug">
                                {serviceability.serviceable
                                  ? `Estimated 2-4 business days • ${
                                      serviceability.codAvailable ? "COD & Prepaid Available" : "Prepaid Only (COD unavailable for this pincode)"
                                    }`
                                  : "Delhivery cannot deliver to this pincode currently. Please check the 6 digits or enter an alternate address."}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Delivery Instructions */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Delivery Notes / Instructions
                      </label>
                      <input
                        type="text"
                        name="instructions"
                        value={formData.instructions}
                        onChange={handleInputChange}
                        placeholder="e.g. Leave at gate or call before delivery"
                        className="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-400 bg-gray-50/20 text-gray-700"
                      />
                    </div>

                    {/* Payment Selector */}
                    <div className="flex flex-col gap-2 mt-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Select Payment Option
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          disabled={serviceability.checked && serviceability.codAvailable === false}
                          onClick={() => {
                            if (serviceability.checked && serviceability.codAvailable === false) {
                              toast.error("COD is unavailable for this pincode. Please pay online.");
                              return;
                            }
                            setFormData(prev => ({ ...prev, paymentMethod: "cod" }));
                          }}
                          className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-bold transition-all duration-200 text-left ${
                            serviceability.checked && serviceability.codAvailable === false
                              ? "opacity-50 cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                              : formData.paymentMethod === "cod"
                              ? "border-[#8C6A43] bg-[#8C6A43]/10 text-[#8C6A43] shadow-sm"
                              : "border-gray-200 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          <span className="flex flex-col gap-0.5">
                            <span className="flex items-center gap-1.5">
                              <Truck className="h-4 w-4" />
                              COD (Cash / UPI)
                            </span>
                            {serviceability.checked && serviceability.codAvailable === false && (
                              <span className="text-[9px] text-red-500 font-semibold">Not available for pincode</span>
                            )}
                          </span>
                          {formData.paymentMethod === "cod" && <CheckCircle className="h-4 w-4 fill-[#8C6A43] text-white" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "online" }))}
                          className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-bold transition-all duration-200 text-left ${formData.paymentMethod === "online"
                              ? "border-[#8C6A43] bg-[#8C6A43]/10 text-[#8C6A43] shadow-sm"
                              : "border-gray-200 text-gray-500 hover:bg-gray-50"
                            }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <CreditCard className="h-4 w-4" />
                            Online Payment
                          </span>
                          {formData.paymentMethod === "online" && <CheckCircle className="h-4 w-4 fill-[#8C6A43] text-white" />}
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400 leading-normal mt-1">
                        {formData.paymentMethod === "cod"
                          ? "Pay securely in cash or via any UPI app at the time of doorstep delivery."
                          : "Pay securely via Razorpay (UPI, Credit/Debit Card, Netbanking)."
                        }
                      </p>
                    </div>

                    {/* Unserviceable Warning Banner */}
                    {serviceability.checked && serviceability.serviceable === false && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium text-center">
                        ⚠️ Delhivery cannot deliver to this pincode. Please update your delivery pincode to continue.
                      </div>
                    )}

                    {/* Checkout Button */}
                    <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={handlePlaceOrder}
                        disabled={isSubmitting || (serviceability.checked && serviceability.serviceable === false)}
                        className={`font-bold py-3.5 px-6 rounded-2xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 ${
                          serviceability.checked && serviceability.serviceable === false
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                            : "bg-gradient-to-r from-[#8C6A43] to-amber-600 hover:from-amber-600 hover:to-[#8C6A43] disabled:from-gray-400 disabled:to-gray-400 text-white hover:-translate-y-0.5 cursor-pointer"
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Sending Order...
                          </>
                        ) : serviceability.checked && serviceability.serviceable === false ? (
                          <>
                            <span>✕ Delivery Unavailable for Pincode</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="h-5 w-5" />
                            Place Your Order
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                </div>

              </div>

            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
