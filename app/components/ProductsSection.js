"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Wheat, X } from "lucide-react";
import ProductCard from "./ProductCard";
import { products, categories, categoryToSlug } from "../data/products";
import Reveal from "./Reveal";

export default function ProductsSection() {
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
          <span className="inline-block text-xs font-bold tracking-widest text-green-600 uppercase bg-green-100 px-4 py-1.5 rounded-full mb-4">
            Our Products
          </span>
          </Reveal>
          <Reveal>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Farm-Fresh Goodness
          </h2>
          </Reveal>
          <Reveal>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Every product is grown and sourced directly from our farm â€” no
            middlemen, no compromises.
          </p>
          </Reveal>
        </div>
        
         <Reveal>
        <div className="flex items-center max-w-md mx-auto mb-8 bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
          <Search
            className="ml-4 h-5 w-5 shrink-0 text-gray-400"
            aria-hidden="true"
          />
          <input
            id="product-search"
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 text-gray-700 text-sm outline-none bg-transparent placeholder-gray-400 min-w-0"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="pr-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </div>
        </Reveal>
        <Reveal>
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-green-600 border-green-600 text-white shadow-md"
                  : "border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-600 bg-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        </Reveal>

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
                  className="inline-flex items-center justify-center bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-700 hover:to-lime-700 text-white px-7 py-3 rounded-full text-sm font-semibold shadow-md hover:shadow-green-200 transition-all duration-300 hover:-translate-y-0.5"
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
