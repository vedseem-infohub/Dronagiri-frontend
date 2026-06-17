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
  Check
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductIcon from "../components/ProductIcon";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { userDataContext } from "@/context/UserContext";
import axios from "axios";

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
  const [activeDiscount, setActiveDiscount] = useState(0); // in percent
  const [promoApplied, setPromoApplied] = useState(""); // applied code string
  const [promoError, setPromoError] = useState("");

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

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Pricing calculations
  const subtotal = getCartTotal();
  const shippingThreshold = 1000;
  const shippingCost = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 60;
  const discountAmount = Math.round((subtotal * activeDiscount) / 100);
  const finalTotal = subtotal - discountAmount + shippingCost;

  // Promo codes logic
  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError("");
    const normalizedCode = promoCode.trim().toUpperCase();

    if (normalizedCode === "DRONAGIRI10" || normalizedCode === "FARM10") {
      setActiveDiscount(10);
      setPromoApplied(normalizedCode);
      setPromoError("");
    } else if (normalizedCode === "DRONAGIRI20" || normalizedCode === "FARM20") {
      if (subtotal >= 1500) {
        setActiveDiscount(20);
        setPromoApplied(normalizedCode);
        setPromoError("");
      } else {
        setPromoError("This promo code requires a minimum order of ₹1,500");
      }
    } else {
      setPromoError("Invalid promo code. Try 'DRONAGIRI10'!");
    }
  };

  const handleRemovePromo = () => {
    setActiveDiscount(0);
    setPromoApplied("");
    setPromoCode("");
  };

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

      await addOrder({
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
        promoCode: promoApplied,
        shippingCost,
        total: finalTotal,
        paymentMethod: formData.paymentMethod,
        source: "admin",
      });

      setCompletedOrderDetails({
        orderId: orderNumber,
        name: formData.name,
        phone: formData.phone,
        address: deliveryAddress,
        total: finalTotal,
      });

      setOrderComplete(true);
      toast.success("Order placed successfully!");
      await clearCart();
    } catch (error) {
      console.error("Failed to place order:", error);
      toast.error(error?.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
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
              Your order has been sent to the admin. You can check the latest
              status anytime from My Orders.
            </p>

            <div className="bg-gray-50 rounded-2xl p-6 text-left mb-8 border border-gray-100 divide-y divide-gray-200/60">
              <div className="py-3 flex justify-between gap-4">
                <span className="text-gray-400 text-sm font-medium">Order Number:</span>
                <span className="text-gray-800 font-bold tracking-wide">{completedOrderDetails.orderId}</span>
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

            <Link
              href="/orders"
              className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#8C6A43] to-amber-600 hover:from-amber-600 hover:to-[#8C6A43] text-white font-semibold py-3.5 px-6 rounded-2xl shadow-md hover:shadow-amber-900/30 transition-all duration-200 hover:-translate-y-0.5"
            >
              <CheckCircle className="h-5 w-5" />
              View Order Status
            </Link>
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
                    {activeDiscount > 0 ? (
                      <div className="flex justify-between items-center bg-green-50 border border-green-200/50 rounded-xl px-3 py-2 text-xs text-green-800">
                        <span className="flex items-center gap-1 font-semibold">
                          <Gift className="h-3.5 w-3.5 text-green-600 animate-pulse" />
                          Code {promoApplied} ({activeDiscount}% OFF)
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">-₹{discountAmount}</span>
                          <button
                            onClick={handleRemovePromo}
                            className="text-[10px] font-bold text-red-500 hover:text-red-700 underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyPromo} className="flex gap-2 my-1.5">
                        <input
                          type="text"
                          placeholder="PROMO CODE (DRONAGIRI10)"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs uppercase focus:outline-none focus:border-green-400 bg-gray-50/50 text-gray-700"
                        />
                        <button
                          type="submit"
                          className="bg-gray-800 hover:bg-gray-900 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all"
                        >
                          Apply
                        </button>
                      </form>
                    )}
                    {promoError && (
                      <p className="text-[10px] font-bold text-red-500 mt-1">{promoError}</p>
                    )}

                    {/* Shipping Costs */}
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-400 flex items-center gap-1">
                        <Truck className="h-4 w-4 text-gray-300" />
                        Delivery Shipping
                      </span>
                      {shippingCost === 0 ? (
                        <span className="text-[#223614] font-bold bg-[#223614]/10 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                          FREE
                        </span>
                      ) : (
                        <span className="text-gray-800 font-bold">₹{shippingCost}</span>
                      )}
                    </div>
                    {shippingCost > 0 && (
                      <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-2.5 text-[11px] text-amber-800 flex items-center gap-2 leading-relaxed">
                        <span>💡 Add <b>₹{shippingThreshold - subtotal}</b> more for FREE Shipping!</span>
                      </div>
                    )}

                    <div className="border-t border-gray-100 pt-4 mt-2 flex justify-between items-end">
                      <span className="text-gray-600 font-semibold text-base">Grand Total</span>
                      <div className="text-right">
                        <span className="text-2xl font-black text-[#223614] block">
                          ₹{finalTotal}
                        </span>
                        <span className="text-[10px] text-gray-400 block font-medium">inclusive of taxes</span>
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
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Pincode <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          maxLength="6"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          placeholder="400001"
                          className={`border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#8C6A43] bg-gray-50/20 text-gray-700 ${formErrors.pincode ? "border-red-400 focus:ring-red-400" : "border-gray-200"
                            }`}
                        />
                        {formErrors.pincode && (
                          <span className="text-[10px] font-bold text-red-500">{formErrors.pincode}</span>
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
                          onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "cod" }))}
                          className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-bold transition-all duration-200 text-left ${formData.paymentMethod === "cod"
                              ? "border-[#8C6A43] bg-[#8C6A43]/10 text-[#8C6A43] shadow-sm"
                              : "border-gray-200 text-gray-500 hover:bg-gray-50"
                            }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <Truck className="h-4 w-4" />
                            COD (Cash / UPI)
                          </span>
                          {formData.paymentMethod === "cod" && <CheckCircle className="h-4 w-4 fill-[#8C6A43] text-white" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "bank" }))}
                          className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-bold transition-all duration-200 text-left ${formData.paymentMethod === "bank"
                              ? "border-[#8C6A43] bg-[#8C6A43]/10 text-[#8C6A43] shadow-sm"
                              : "border-gray-200 text-gray-500 hover:bg-gray-50"
                            }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <CreditCard className="h-4 w-4" />
                            Bank Transfer
                          </span>
                          {formData.paymentMethod === "bank" && <CheckCircle className="h-4 w-4 fill-[#8C6A43] text-white" />}
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400 leading-normal mt-1">
                        {formData.paymentMethod === "cod"
                          ? "Pay securely in cash or via any UPI app at the time of doorstep delivery."
                          : "Transfer directly to Dronagiri Farm Bank A/c. Details will be provided on confirmation."
                        }
                      </p>
                    </div>

                    {/* Checkout Button */}
                    <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={handlePlaceOrder}
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-[#8C6A43] to-amber-600 hover:from-amber-600 hover:to-[#8C6A43] disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Sending Order...
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
