"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Star, Minus, Plus, ShoppingCart, ArrowLeft, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { categoryColors } from "../data/products";
import { useCart } from "@/context/CartContext";
import { userDataContext } from "@/context/UserContext";
import { toast } from "sonner";
import ProductCard from "./ProductCard";

export default function ProductDetailClient({ product, allProducts }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isLoggedIn, loding } = useContext(userDataContext);

  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.imageUrl || "");

  // Update active image if the product changes
  useEffect(() => {
    setActiveImage(product.imageUrl || "");
    setSelectedVariant(0);
    setQuantity(1);
  }, [product]);

  const variant = product.variants[selectedVariant] || product.variants[0];
  const catColor = categoryColors[product.category] || "bg-gray-100 text-gray-700";

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  // Determine related products: same category, excluding current product
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // If there are fewer than 4 related products in the same category, fill with others
  if (relatedProducts.length < 4) {
    const extraProducts = allProducts
      .filter((p) => p.id !== product.id && p.category !== product.category)
      .slice(0, 4 - relatedProducts.length);
    relatedProducts.push(...extraProducts);
  }

  const handleAddToCart = async () => {
    if (loding) return;

    if (!isLoggedIn) {
      toast.error("Please sign in first", {
        description: "You need to be logged in to add items to your cart.",
        action: {
          label: "Sign In",
          onClick: () => router.push(`/login?redirect=/product/${product.id}`),
        },
      });
      router.push(`/login?redirect=/product/${product.id}`);
      return;
    }

    try {
      await addToCart(product, variant.quantity, quantity);
      toast.success("Added to Cart!", {
        description: `${quantity} x ${product.name} (${variant.quantity}) successfully added.`,
        action: {
          label: "View Cart",
          onClick: () => (window.location.href = "/cart"),
        },
      });
    } catch (error) {
      toast.error("Could not add item", {
        description: error?.response?.data?.message || "Please try again.",
      });
    }
  };

  const handleBuyNow = async () => {
    if (loding) return;

    if (!isLoggedIn) {
      toast.error("Please sign in first", {
        description: "You need to be logged in to buy items.",
        action: {
          label: "Sign In",
          onClick: () => router.push(`/login?redirect=/product/${product.id}`),
        },
      });
      router.push(`/login?redirect=/product/${product.id}`);
      return;
    }

    try {
      await addToCart(product, variant.quantity, quantity);
      toast.success("Ready to Buy!", {
        description: `${quantity} x ${product.name} (${variant.quantity}) added to cart. Proceeding to checkout.`,
      });
      router.push("/cart");
    } catch (error) {
      toast.error("Could not complete checkout", {
        description: error?.response?.data?.message || "Please try again.",
      });
    }
  };

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto">
      {/* Back navigation & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#8C6A43] hover:text-[#223614] transition-colors font-medium text-sm focus:outline-none cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Back to browse
        </button>
        <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
          <Link href="/" className="hover:text-[#8C6A43] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#8C6A43] transition-colors">Products</Link>
          <span>/</span>
          <span className="text-[#8C6A43] capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-gray-600 truncate max-w-[150px]">{product.name}</span>
        </div>
      </div>

      {/* Main product layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-6 md:p-10 shadow-lg border border-[#8C6A43]/10 mb-16">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="relative bg-gradient-to-br from-[#F7F1E8] via-[#fdfbf7] to-amber-50/50 flex items-center justify-center overflow-hidden rounded-2xl border border-[#8C6A43]/15 h-[300px] md:h-[450px]">
            {product.badge && (
              <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
                <Sparkles className="h-3.5 w-3.5 fill-current animate-pulse" />
                {product.badge}
              </span>
            )}
            
            {activeImage ? (
              <motion.img
                key={activeImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-zoom-in"
              />
            ) : (
              <div className="text-[#223614] select-none p-8 text-center" aria-hidden="true">
                <span className="text-lg font-bold">No Image Available</span>
              </div>
            )}
          </div>

          {/* Thumbnails (imageUrl & imageUrl2) */}
          {product.imageUrl2 && (
            <div className="flex gap-3 mt-2 justify-center lg:justify-start">
              <button
                onClick={() => setActiveImage(product.imageUrl)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  activeImage === product.imageUrl
                    ? "border-[#8C6A43] shadow-md scale-102"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <img src={product.imageUrl} alt="Thumbnail 1" className="w-full h-full object-cover" />
              </button>
              <button
                onClick={() => setActiveImage(product.imageUrl2)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  activeImage === product.imageUrl2
                    ? "border-[#8C6A43] shadow-md scale-102"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <img src={product.imageUrl2} alt="Thumbnail 2" className="w-full h-full object-cover" />
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div>
            <span className={`inline-block text-xs font-semibold px-3.5 py-1.5 rounded-full mb-3 shadow-sm ${catColor}`}>
              {product.category}
            </span>
            
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>
            <p className="text-[#8C6A43] text-lg md:text-xl font-medium mt-1">
              {product.nameHindi}
            </p>

            {/* Stars Rating */}
            <div className="flex items-center gap-1.5 mt-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="text-sm text-gray-500 font-medium mt-0.5">4.8 / 5.0 Rating</span>
            </div>
          </div>

          <div className="h-[2px] bg-gray-100 w-full" />

          {/* Description */}
          <div>
            <h3 className="text-sm text-gray-400 uppercase tracking-widest mb-2 font-semibold">
              Product Description
            </h3>
            <p className="text-gray-600 text-base leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Variant Selection */}
          <div>
            <h3 className="text-sm text-gray-400 uppercase tracking-widest mb-3 font-semibold">
              Select Package Size
            </h3>
            <div className="flex flex-wrap gap-3">
              {product.variants.map((v, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedVariant(i);
                    setQuantity(1); // reset quantity on variant change
                  }}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 cursor-pointer ${
                    selectedVariant === i
                      ? "border-[#8C6A43] bg-[#8C6A43]/10 text-[#8C6A43] shadow-md scale-102"
                      : "border-gray-200 text-gray-500 hover:border-[#8C6A43]/40 hover:text-[#8C6A43] bg-white"
                  }`}
                >
                  {v.quantity}
                </button>
              ))}
            </div>
          </div>

          {/* Price & Quantity Adjuster */}
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <div>
              <span className="text-4xl font-extrabold text-[#223614]">
                ₹{variant.price}
              </span>
              <span className="text-gray-400 text-sm ml-1.5">/ {variant.quantity}</span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50/50 p-1.5 shadow-sm">
              <button
                onClick={handleDecrement}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white hover:text-[#8C6A43] text-gray-400 hover:shadow-sm transition-all duration-200 focus:outline-none cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-base font-bold text-gray-700 select-none">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white hover:text-[#8C6A43] text-gray-400 hover:shadow-sm transition-all duration-200 focus:outline-none cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <button
              onClick={handleAddToCart}
              className="w-full border-2 border-[#8C6A43] text-[#8C6A43] hover:bg-[#8C6A43]/5 text-base font-bold py-3.5 px-6 rounded-xl transition-all duration-200 hover:-translate-y-0.5 text-center flex items-center justify-center gap-2 cursor-pointer focus:outline-none shadow-sm hover:shadow-md"
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="w-full bg-gradient-to-r from-[#8C6A43] to-amber-600 hover:from-amber-600 hover:to-[#8C6A43] text-white text-base font-bold py-3.5 px-6 rounded-xl transition-all duration-200 hover:-translate-y-0.5 text-center flex items-center justify-center gap-2 cursor-pointer focus:outline-none shadow-md hover:shadow-lg"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Explore More Products section */}
      <div className="pt-8 border-t border-gray-100">
        <div className="text-center mb-12">
          <span className="inline-block text-[#8C6A43] text-xs font-bold tracking-[0.3em] uppercase mb-4 border-b-2 border-[#8C6A43]/40 pb-2">
            Recommendations
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-[#223614] mb-3">
            Explore our more products
          </h2>
          <p className="text-[#8C6A43] text-sm md:text-base max-w-xl mx-auto font-light">
            Try other pure and organic products from our {product.category} collection.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeIn">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
