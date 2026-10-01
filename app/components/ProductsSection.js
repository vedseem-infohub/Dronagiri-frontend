"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Search, Wheat, X, Tag } from "lucide-react";
import ProductCard from "./ProductCard";
import { useCart } from "@/context/CartContext";
import Reveal from "./Reveal";

function categoryToSlug(category) {
  return String(category || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ProductsSection({ initialProducts = [] }) {
  const { products: cartProducts } = useCart();
  const products = cartProducts && cartProducts.length > 0 ? cartProducts : initialProducts;
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [apiCategories, setApiCategories] = useState([]);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_BACKEND_URL ||
      process.env.NEXT_API_BACKEND_URL ||
      "https://dronagiri-backend-e4ja.onrender.com"
      }/api/categories`
    )
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setApiCategories(data.map((c) => c.name));
        }
      })
      .catch(() => { });
  }, []);

  const categoryList = useMemo(() => {
    const set = new Set();
    apiCategories.forEach((cat) => set.add(cat));
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [apiCategories, products]);

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

  const hasFilter = activeCategory !== "All" || search.trim() !== "";

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
          <div className="w-full max-w-xl mx-auto mb-8 bg-white rounded-2xl sm:rounded-full shadow-md border border-[#8C6A43]/20 focus-within:border-[#8C6A43] overflow-hidden transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center">
              {/* Category Dropdown */}
              <div className="relative border-b sm:border-b-0 sm:border-r border-[#8C6A43]/15 bg-[#fdfbf7] sm:bg-transparent flex items-center shrink-0">
                <Tag className="ml-3.5 h-4 w-4 shrink-0 text-[#8C6A43]/70 pointer-events-none" aria-hidden="true" />
                <select
                  id="homepage-category-search-dropdown"
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="w-full sm:w-44 md:w-48 pl-2.5 pr-8 py-3 bg-transparent text-[#223614] text-xs sm:text-sm font-semibold outline-none cursor-pointer appearance-none truncate"
                  aria-label="Select Category"
                >
                  <option value="All" className="bg-white text-[#223614]">All Categories</option>
                  {categoryList.map((cat) => (
                    <option key={cat} value={cat} className="bg-white text-[#223614]">
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#8C6A43]/70">
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>

              {/* Search Input */}
              <div className="flex items-center flex-1 min-w-0">
                <Search
                  className="ml-3.5 h-4.5 w-4.5 shrink-0 text-[#8C6A43]/60 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="product-search"
                  type="text"
                  placeholder={activeCategory === "All" ? "Search farm-fresh products..." : `Search in ${activeCategory}...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 px-3 py-3 text-[#223614] text-sm outline-none bg-transparent placeholder-[#8C6A43]/40 min-w-0"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="pr-3.5 text-[#8C6A43]/60 hover:text-[#8C6A43] transition-colors cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="h-4.5 w-4.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Filter Feedback / Clear */}
        {hasFilter && (
          <div className="flex items-center justify-center gap-2 mb-6 text-xs text-[#8C6A43]">
            <span>
              Found <strong className="text-[#223614]">{filtered.length}</strong> product{filtered.length !== 1 ? "s" : ""}
              {activeCategory !== "All" && <span> in <strong className="text-[#223614]">{activeCategory}</strong></span>}
              {search && <span> matching &ldquo;<strong className="text-[#223614]">{search}</strong>&rdquo;</span>}
            </span>
            <button
              onClick={() => {
                setActiveCategory("All");
                setSearch("");
              }}
              className="inline-flex items-center gap-1 font-semibold text-[#8C6A43] hover:text-red-600 ml-2 transition-colors cursor-pointer"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          </div>
        )}
        {/* <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map((cat, i) => (
            <Reveal key={cat} delay={i * 0.1}>
              <button
                key={cat}
                id={`filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-200 ${activeCategory === cat
                    ? "bg-[#223614] border-[#223614] text-[#F7F1E8] shadow-md"
                    : "border-[#8C6A43]/20 text-[#223614]/80 hover:border-[#8C6A43] hover:text-[#8C6A43] bg-white"
                  }`}
              >
                {cat}
              </button>
            </Reveal>
          ))}
        </div> */}

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
        ) : products.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white rounded-3xl overflow-hidden shadow-md border border-[#8C6A43]/15 p-5 animate-pulse flex flex-col gap-4 h-96"
              >
                <div className="bg-[#8C6A43]/10 rounded-2xl h-48 w-full" />
                <div className="h-5 bg-[#8C6A43]/15 rounded-md w-3/4" />
                <div className="h-4 bg-[#8C6A43]/10 rounded-md w-1/2" />
                <div className="h-9 bg-[#8C6A43]/20 rounded-xl mt-auto w-full" />
              </div>
            ))}
          </div>
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
