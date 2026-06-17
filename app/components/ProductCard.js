"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Star, Minus, Plus } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { categoryColors } from "../data/products";
import ProductIcon from "./ProductIcon";
import { useCart } from "@/context/CartContext";
// import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { userDataContext } from "@/context/UserContext";

export default function ProductCard({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const { addToCart } = useCart();
  const { isLoggedIn, loding } = useContext(userDataContext);
  const router = useRouter();
  const controls = useAnimation();

  const handleAddToCartAnimation = async () => {
    await controls.start({
      x: 300,
      y: -200,
      scale: 0.2,
      opacity: 0,
      transition: { duration: 0.6, ease: "easeInOut" },
    });

    controls.set({ x: 0, y: 0, scale: 1, opacity: 1 });
  };

  const variant = product.variants[selectedVariant];
  const catColor =
    categoryColors[product.category] || "bg-gray-100 text-gray-700";

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  return (
    <div
      id={`product-${product.id}`}
      className="product-card bg-white rounded-3xl overflow-hidden shadow-md border border-[#8C6A43]/15 flex flex-col h-full group"
    >
      <Link href={`/product/${product.id}`} className="relative bg-gradient-to-br from-[#F7F1E8] via-[#fdfbf7] to-amber-50/50 flex items-center justify-center overflow-hidden h-52 cursor-pointer block shrink-0">
        {product.badge && (
          <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
            <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
            {product.badge}
          </span>
        )}
        
        {product.imageUrl ? (
          <div className="w-full h-full relative">
            <img
              src={product.imageUrl}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105 ${
                product.imageUrl2 ? "group-hover:opacity-0" : ""
              }`}
            />
            {product.imageUrl2 && (
              <img
                src={product.imageUrl2}
                alt={`${product.name} Hover`}
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out scale-100 group-hover:scale-105"
              />
            )}
          </div>
        ) : (
          <div className="text-[#223614] select-none p-8" aria-hidden="true">
            <ProductIcon product={product} className="h-16 w-16" />
          </div>
        )}

        <span
          className={`absolute bottom-4 left-4 text-xs font-semibold px-3 py-1 rounded-full z-10 ${catColor}`}
        >
          {product.category}
        </span>
      </Link>

      <div className="p-5 flex flex-col flex-1 gap-3">
        <Link href={`/product/${product.id}`} className="block hover:opacity-85 transition-opacity cursor-pointer group/title">
          <h3 className="font-[family-name:var(--font-playfair)] text-gray-900 font-bold text-xl leading-tight group-hover/title:text-[#8C6A43] transition-colors">
            {product.name}
          </h3>
          <p className="text-[#8C6A43] text-sm font-medium mt-0.5">
            {product.nameHindi}
          </p>
        </Link>

        <div className="text-gray-500 text-sm leading-relaxed flex-1 flex flex-col justify-between">
          <p className={isExpanded ? "" : "line-clamp-2"}>
            {product.description}
          </p>
          {product.description && product.description.length > 50 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsExpanded(!isExpanded);
              }}
              className="text-[#8C6A43] hover:text-[#223614] font-semibold text-xs mt-1 self-start transition-colors focus:outline-none cursor-pointer"
            >
              {isExpanded ? "Read Less" : "Read More"}
            </button>
          )}
        </div>

        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-2 font-semibold">
            Select Quantity
          </p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v, i) => (
              <button
                key={i}
                id={`variant-${product.id}-${i}`}
                onClick={() => {
                  setSelectedVariant(i);
                  setQuantity(1); // Reset quantity on variant change
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all duration-200 ${
                  selectedVariant === i
                    ? "border-[#8C6A43] bg-[#8C6A43]/10 text-[#8C6A43] shadow-sm"
                    : "border-gray-200 text-gray-500 hover:border-[#8C6A43]/40 hover:text-[#8C6A43]"
                }`}
              >
                {v.quantity}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-[#223614]">
                ₹{variant.price}
              </span>
              <span className="text-gray-400 text-sm ml-1">/ {variant.quantity}</span>
            </div>

            {/* Elegant Quantity Adjuster */}
            <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50/50 p-1">
              <button
                onClick={handleDecrement}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white hover:text-[#8C6A43] text-gray-400 hover:shadow-sm transition-all duration-200"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-semibold text-gray-700 select-none">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white hover:text-[#8C6A43] text-gray-400 hover:shadow-sm transition-all duration-200"
                aria-label="Increase quantity"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <motion.button
            // animate={controls}
            onClick={async () => {
              if (loding) return;

              if (!isLoggedIn) {
                toast.error("Please sign in first", {
                  description: "You need to be logged in to add items to your cart.",
                  action: {
                    label: "Sign In",
                    onClick: () => router.push("/login?redirect=/products"),
                  },
                });
                router.push("/login?redirect=/products");
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
                setQuantity(1);
              } catch (error) {
                toast.error("Could not add item", {
                  description:
                    error?.response?.data?.message || "Please try again.",
                });
              }
              // await handleAddToCartAnimation();
            }}
            className="w-full bg-gradient-to-r from-[#8C6A43] to-amber-600 hover:from-amber-600 hover:to-[#8C6A43] text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 text-center cursor-pointer"
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </div>
  );
}
