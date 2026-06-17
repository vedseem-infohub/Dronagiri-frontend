"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Wheat, X } from "lucide-react";
import ProductCard from "./ProductCard";
import { categories, categoryToSlug } from "../data/products";
import { useCart } from "@/context/CartContext";
import Reveal from "./Reveal";

export default function ProductsSection() {
  const { products } = useCart();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) => {
    const matchCat =
      activeCategory === "All" || p.category === activeCategory;
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.nameHindi.includes(search) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const visibleProducts = filtered.slice(0, 4);
  const showViewMore = filtered.length > visibleProducts.length;
  const viewMoreHref =
    activeCategory === "All"
      ? "/products"
      : `/products/${categoryToSlug(activeCategory)}`;

  return (
    <section id="products" className="py-20 px-4 bg-[#fdfbf7]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Reveal>
          <span className="inline-block text-[#8C6A43] text-xs font-bold tracking-[0.3em] uppercase mb-4 border-b-2 border-[#8C6A43]/40 pb-2">
            Our Products
          </span>
          </Reveal>
          <Reveal>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl font-bold text-[#223614] mb-4">
            Farm-Fresh <span className="italic text-[#8C6A43]">Goodness</span>
          </h2>
          </Reveal>
          <Reveal>
          <p className="text-[#8C6A43] text-lg max-w-xl mx-auto font-light">
            Every product is grown and sourced directly from our farm — no
            middlemen, no compromises.
          </p>
          </Reveal>
        </div>
        
         <Reveal>
        <div className="flex items-center max-w-md mx-auto mb-8 bg-white rounded-2xl shadow-md border border-[#8C6A43]/20 focus-within:border-[#8C6A43] overflow-hidden transition-all duration-300">
          <Search
            className="ml-4 h-5 w-5 shrink-0 text-[#8C6A43]/60"
            aria-hidden="true"
          />
          <input
            id="product-search"
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 text-[#223614] text-sm outline-none bg-transparent placeholder-[#8C6A43]/40 min-w-0"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="pr-4 text-[#8C6A43]/60 hover:text-[#8C6A43] transition-colors"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </div>
        </Reveal>
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map((cat, i) => (
          <Reveal key={cat} delay={i * 0.1}>
            <button
              key={cat}
              id={`filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-[#223614] border-[#223614] text-[#F7F1E8] shadow-md"
                  : "border-[#8C6A43]/20 text-[#223614]/80 hover:border-[#8C6A43] hover:text-[#8C6A43] bg-white"
              }`}
            >
              {cat}
            </button>
        </Reveal>
          ))}
        </div>

        {search && (
          <p className="text-center text-sm text-gray-500 mb-6">
            Found{" "}
            <span className="font-semibold text-green-600">
              {filtered.length}
            </span>{" "}
            product{filtered.length !== 1 ? "s" : ""}
          </p>
        )}

        {filtered.length > 0 ? (
          <>
          <Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </Reveal>
            {showViewMore && (
              <Reveal>
              <div className="text-center mt-10">
                <Link
                  href={viewMoreHref}
                  className="inline-flex items-center justify-center bg-gradient-to-r from-[#8C6A43] to-amber-600 hover:from-amber-600 hover:to-[#8C6A43] text-white px-8 py-3.5 rounded-full text-sm font-semibold shadow-md hover:shadow-amber-900/30 transition-all duration-300 hover:-translate-y-0.5"
                >
                  View More
                </Link>
              </div>
              </Reveal>
            )}
          </>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <Wheat className="mx-auto mb-4 h-12 w-12" aria-hidden="true" />
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm mt-1">Try a different search or category</p>
          </div>
        )}
      </div>
    </section>
  );
}
