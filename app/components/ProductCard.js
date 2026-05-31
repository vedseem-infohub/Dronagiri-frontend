"use client";

import { useState } from "react";
import { Star, Minus, Plus } from "lucide-react";
import { categoryColors } from "../data/products";
import ProductIcon from "./ProductIcon";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

export default function ProductCard({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  
  const variant = product.variants[selectedVariant];
  const catColor =
    categoryColors[product.category] || "bg-gray-100 text-gray-700";

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  return (
    <div
      id={`product-${product.id}`}
      className="product-card bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 flex flex-col h-full"
    >
      <div className="relative bg-gradient-to-br from-green-50 via-lime-50 to-amber-50 p-8 flex items-center justify-center">
        {product.badge && (
          <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
            {product.badge}
          </span>
        )}
        <div className="text-green-700 select-none" aria-hidden="true">
          <ProductIcon product={product} className="h-16 w-16" />
        </div>
        <span
          className={`absolute bottom-4 left-4 text-xs font-semibold px-3 py-1 rounded-full ${catColor}`}
        >
          {product.category}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-[family-name:var(--font-playfair)] text-gray-900 font-bold text-xl leading-tight">
            {product.name}
          </h3>
          <p className="text-amber-600 text-sm font-medium mt-0.5">
            {product.nameHindi}
          </p>
        </div>

        <p className="text-gray-500 text-sm leading-relaxed flex-1">
          {product.description}
        </p>

        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-2 font-semibold">
            Select Size
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
                    ? "border-green-500 bg-green-50 text-green-700 shadow-sm"
                    : "border-gray-200 text-gray-500 hover:border-green-300 hover:text-green-600"
                }`}
              >
                {v.size}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-green-700">
                ₹{variant.price}
              </span>
              <span className="text-gray-400 text-sm ml-1">/ {variant.size}</span>
            </div>

            {/* Elegant Quantity Adjuster */}
            <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50/50 p-1">
              <button
                onClick={handleDecrement}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white hover:text-green-600 text-gray-400 hover:shadow-sm transition-all duration-200"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-semibold text-gray-700 select-none">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white hover:text-green-600 text-gray-400 hover:shadow-sm transition-all duration-200"
                aria-label="Increase quantity"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              addToCart(product, variant.size, quantity);
              toast.success("Added to Cart!", {
                description: `${quantity} x ${product.name} (${variant.size}) successfully added.`,
                action: {
                  label: "View Cart",
                  onClick: () => (window.location.href = "/cart"),
                },
              });
              setQuantity(1);
            }}
            className="w-full bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-700 hover:to-lime-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 text-center cursor-pointer"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
