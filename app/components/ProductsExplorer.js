"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, X, SlidersHorizontal, Wheat, Tag, ArrowUpDown } from "lucide-react";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";

export default function ProductsExplorer({ initialProducts = [] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("featured");
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

  // Dynamic category list combining api categories + any unique categories from server products
  const categoryList = useMemo(() => {
    const set = new Set();
    apiCategories.forEach((cat) => set.add(cat));
    initialProducts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [apiCategories, initialProducts]);

  // Precompute product counts per category for the dropdown
  const categoryCounts = useMemo(() => {
    const counts = { All: initialProducts.length };
    initialProducts.forEach((p) => {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });
    return counts;
  }, [initialProducts]);

  // Filter & Sort products
  const filteredProducts = useMemo(() => {
    let result = initialProducts.filter((p) => {
      const matchCat =
        activeCategory === "All" ||
        (p.category && p.category.toLowerCase() === activeCategory.toLowerCase());

      const query = search.trim().toLowerCase();
      const matchSearch =
        !query ||
        p.name?.toLowerCase().includes(query) ||
        p.nameHindi?.includes(query) ||
        p.category?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query);

      return matchCat && matchSearch;
    });

    // Sorting
    if (sortBy === "price-low") {
      result = [...result].sort((a, b) => {
        const pA = a.variants?.[0]?.price || 0;
        const pB = b.variants?.[0]?.price || 0;
        return pA - pB;
      });
    } else if (sortBy === "price-high") {
      result = [...result].sort((a, b) => {
        const pA = a.variants?.[0]?.price || 0;
        const pB = b.variants?.[0]?.price || 0;
        return pB - pA;
      });
    } else if (sortBy === "name-asc") {
      result = [...result].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    return result;
  }, [initialProducts, activeCategory, search, sortBy]);

  const hasActiveFilters = activeCategory !== "All" || search.trim() !== "";

  const handleClearFilters = () => {
    setActiveCategory("All");
    setSearch("");
  };

  return (
    <div className="w-full">
      {/* Category-Wise Search & Filter Panel */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-lg border border-[#8C6A43]/15 mb-10 transition-all">
        {/* Responsive Search & Dropdowns Grid */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
          {/* Search Input Bar (full width on mobile/tablet, centered on desktop) */}
          <div className="relative flex-1 w-full order-1 lg:order-2 min-w-0">
            <label htmlFor="customer-product-search" className="sr-only">
              Search Products
            </label>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C6A43]/60">
              <Search className="h-4 w-4" />
            </div>
            <input
              id="customer-product-search"
              type="text"
              placeholder={
                activeCategory === "All"
                  ? "Search products (e.g. Turmeric, Haldi, Ragi)..."
                  : `Search within ${activeCategory}...`
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 h-11 sm:h-12 bg-[#fdfbf7] border border-[#8C6A43]/25 rounded-2xl text-sm text-[#223614] placeholder-[#8C6A43]/45 focus:outline-none focus:ring-2 focus:ring-[#8C6A43]/40 focus:border-[#8C6A43] transition-all shadow-sm"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8C6A43]/60 hover:text-[#8C6A43] transition-colors cursor-pointer"
                title="Clear search text"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category & Sort Dropdowns (Stacked on mobile, 2-columns on tablet, inline on desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex items-center gap-3 w-full lg:w-auto order-2 lg:order-1 shrink-0">
            {/* Category Dropdown */}
            <div className="relative w-full lg:w-60 min-w-0">
              <label htmlFor="customer-category-dropdown" className="sr-only">
                Filter by Category
              </label>
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C6A43]">
                <Tag className="h-4 w-4" />
              </div>
              <select
                id="customer-category-dropdown"
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="w-full h-11 sm:h-12 pl-10 pr-9 bg-[#fdfbf7] border border-[#8C6A43]/25 rounded-2xl text-xs sm:text-sm font-semibold text-[#223614] focus:outline-none focus:ring-2 focus:ring-[#8C6A43]/40 focus:border-[#8C6A43] transition-all cursor-pointer appearance-none shadow-sm truncate"
              >
                {categoryList.map((cat) => (
                  <option key={cat} value={cat} className="bg-white text-[#223614] py-1">
                    {cat === "All"
                      ? `All Categories (${categoryCounts.All || 0})`
                      : `${cat} (${categoryCounts[cat] || 0})`}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#8C6A43]/70">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>

            {/* Sort By Dropdown */}
            <div className="relative w-full lg:w-48 min-w-0">
              <label htmlFor="customer-sort-dropdown" className="sr-only">
                Sort Products
              </label>
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C6A43]/70">
                <ArrowUpDown className="h-4 w-4" />
              </div>
              <select
                id="customer-sort-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full h-11 sm:h-12 pl-10 pr-9 bg-[#fdfbf7] border border-[#8C6A43]/25 rounded-2xl text-xs sm:text-sm font-medium text-[#223614] focus:outline-none focus:ring-2 focus:ring-[#8C6A43]/40 focus:border-[#8C6A43] transition-all cursor-pointer appearance-none shadow-sm truncate"
              >
                <option value="featured" className="bg-white text-[#223614]">Sort: Featured</option>
                <option value="price-low" className="bg-white text-[#223614]">Price: Low to High</option>
                <option value="price-high" className="bg-white text-[#223614]">Price: High to Low</option>
                <option value="name-asc" className="bg-white text-[#223614]">Name: A to Z</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#8C6A43]/70">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Category Chips for Fast 1-Click Filtering */}
        <div className="mt-4 pt-4 border-t border-[#8C6A43]/10 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-xs font-semibold text-[#8C6A43] shrink-0 uppercase tracking-wider pl-1 hidden sm:inline">
            Quick Filter:
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {categoryList.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${isSelected
                      ? "bg-[#223614] text-white shadow-sm"
                      : "bg-[#fdfbf7] text-[#223614]/70 hover:bg-[#8C6A43]/10 hover:text-[#8C6A43] border border-[#8C6A43]/15"
                    }`}
                >
                  {cat}
                  <span
                    className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${isSelected
                        ? "bg-white/20 text-white"
                        : "bg-[#8C6A43]/10 text-[#8C6A43]"
                      }`}
                  >
                    {categoryCounts[cat] || 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filter Summary Bar */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#8C6A43]">
          <div>
            Showing{" "}
            <span className="font-bold text-[#223614]">
              {filteredProducts.length}
            </span>{" "}
            of{" "}
            <span className="font-bold text-[#223614]">
              {initialProducts.length}
            </span>{" "}
            farm-fresh products
            {activeCategory !== "All" && (
              <span>
                {" "}
                in category{" "}
                <span className="font-semibold text-[#223614]">
                  "{activeCategory}"
                </span>
              </span>
            )}
            {search && (
              <span>
                {" "}
                matching{" "}
                <span className="font-semibold text-[#223614]">
                  "{search}"
                </span>
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 font-semibold text-xs text-[#8C6A43] hover:text-red-600 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, i) => (
            <Reveal key={product.id || i} delay={(i % 8) * 0.05}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#8C6A43]/15 shadow-sm p-8 max-w-lg mx-auto">
          <Wheat className="mx-auto mb-4 h-14 w-14 text-[#8C6A43]/50 animate-bounce" />
          <h3 className="text-xl font-bold text-[#223614] mb-2 font-[family-name:var(--font-playfair)]">
            No products found
          </h3>
          <p className="text-sm text-[#8C6A43] mb-6">
            We couldn't find any products
            {activeCategory !== "All" ? ` in category "${activeCategory}"` : ""}
            {search ? ` matching "${search}"` : ""}. Try adjusting your search
            or selecting another category.
          </p>
          <button
            onClick={handleClearFilters}
            className="inline-flex items-center gap-2 bg-[#223614] hover:bg-[#8C6A43] text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-md"
          >
            <X className="h-4 w-4" />
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
