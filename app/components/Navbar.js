"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div>
              <span
                className={`font-[family-name:var(--font-playfair)] font-bold text-xl leading-tight block transition-colors duration-300 ${
                  scrolled ? "" : "brightness-0 invert"
                }`}
              >
                <Image
                  src="/logo2.png"
                  alt="Dronagiri Farm Logo"
                  width={200}
                  height={150}
                  loading="eager"
                  className={`h-auto transition-[width] duration-300 ${
                    scrolled ? "w-[150px]" : "w-[200px]"
                  }`}
                />
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`font-medium text-sm tracking-wide transition-all duration-300 hover:text-amber-500 relative group ${
                scrolled ? "text-gray-700" : "text-white/90"
              }`}
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full rounded-full" />
            </Link>
            {["Products", "About", "Contact"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className={`font-medium text-sm tracking-wide transition-all duration-300 hover:text-amber-500 relative group ${
                  scrolled ? "text-gray-700" : "text-white/90"
                }`}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full rounded-full" />
              </Link>
            ))}
            
            {/* Desktop Cart Button */}
            <Link
              href="/cart"
              className={`p-2.5 rounded-full hover:bg-amber-500/10 hover:text-amber-500 relative transition-all duration-300 ${
                scrolled ? "text-gray-700 hover:text-amber-600" : "text-white/90 hover:text-amber-300"
              }`}
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-5.5 w-5.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-white text-[10px] font-bold shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              href="/products"
              className="bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-700 hover:to-lime-700 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md hover:shadow-green-300 transition-all duration-300 hover:-translate-y-0.5"
            >
              Shop Now
            </Link>
          </div>

          {/* Mobile Right Controls (Cart & Hamburger) */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Mobile Cart Button */}
            <Link
              href="/cart"
              className={`p-2 rounded-xl relative transition-colors ${
                scrolled ? "text-gray-700" : "text-white"
              }`}
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-5.5 w-5.5" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-amber-500 text-white text-[9px] font-bold shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              id="mobile-menu-btn"
              className={`p-2 rounded-lg transition-colors ${
                scrolled ? "text-gray-700" : "text-white"
              }`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-6 flex flex-col gap-1.5">
                <span
                  className={`block h-0.5 rounded-full transition-all duration-300 ${
                    scrolled ? "bg-gray-700" : "bg-white"
                  } ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
                />
                <span
                  className={`block h-0.5 rounded-full transition-all duration-300 ${
                    scrolled ? "bg-gray-700" : "bg-white"
                  } ${menuOpen ? "opacity-0" : ""}`}
                />
                <span
                  className={`block h-0.5 rounded-full transition-all duration-300 ${
                    scrolled ? "bg-gray-700" : "bg-white"
                  } ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            menuOpen ? "max-h-80 mt-4" : "max-h-0"
          }`}
        >
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl flex flex-col gap-2">
            {["Home", "Products", "About", "Contact"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 font-medium px-4 py-2.5 rounded-xl hover:bg-green-50 hover:text-green-700 transition-colors"
              >
                {item}
              </Link>
            ))}
            
            {/* Mobile Menu Cart Link */}
            <Link
              href="/cart"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between text-gray-700 font-medium px-4 py-2.5 rounded-xl hover:bg-green-50 hover:text-green-700 transition-colors"
            >
              <span className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-gray-500" />
                Shopping Cart
              </span>
              {cartCount > 0 && (
                <span className="bg-amber-500 text-white px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              href="/products"
              onClick={() => setMenuOpen(false)}
              className="bg-gradient-to-r from-green-600 to-lime-600 text-white px-4 py-2.5 rounded-xl font-semibold text-center mt-1"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
