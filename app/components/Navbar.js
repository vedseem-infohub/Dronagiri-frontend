"use client";

import { useContext, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PackageCheck, ShoppingCart, LogIn, LogOut, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
// import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { userDataContext } from "@/context/UserContext";

export default function Navbar({ solid = false }) {
  const [scrolledState, setScrolledState] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { getCartCount } = useCart();
  const { isLoggedIn, userData: user, logout } = useContext(userDataContext);
  const router = useRouter();
  const cartCount = getCartCount();
  const scrolled = scrolledState || solid;

  const navItems = [
    { label: "Products", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "My Orders", href: "/orders" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolledState(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setMenuOpen(false);
      toast.success("Signed out successfully.");
      router.push("/");
    } catch (error) {
      toast.error("Logout failed", {
        description: error?.response?.data?.message || "Please try again.",
      });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${scrolled
        ? "bg-[#F7F1E8]/95 backdrop-blur-md shadow-lg border-[#8C6A43]/15 py-3"
        : "bg-transparent border-transparent py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div>
              <span
                className={`font-[family-name:var(--font-playfair)] font-bold text-xl leading-tight block transition-colors duration-300 ${scrolled ? "" : "brightness-0 invert"
                  }`}
              >
                <Image
                  src="/logo2.png"
                  alt="Dronagiri Farm Logo"
                  width={200}
                  height={150}
                  loading="eager"
                  className={`h-auto transition-[width] duration-300 ${scrolled ? "w-[150px]" : "w-[200px]"
                    }`}
                />
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`font-medium text-sm tracking-wide transition-all duration-300 hover:text-[#8C6A43] relative group ${scrolled ? "text-[#223614]" : "text-[#F7F1E8]"
                }`}
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#8C6A43] transition-all duration-300 group-hover:w-full rounded-full" />
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium text-sm tracking-wide transition-all duration-300 hover:text-[#8C6A43] relative group ${scrolled ? "text-[#223614]" : "text-[#F7F1E8]"
                  }`}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#8C6A43] transition-all duration-300 group-hover:w-full rounded-full" />
              </Link>
            ))}
            <Link
              href="/cart"
              className={`p-2.5 rounded-full hover:bg-[#8C6A43]/10 hover:text-[#8C6A43] relative transition-all duration-300 ${scrolled ? "text-[#223614] hover:text-[#8C6A43]" : "text-[#F7F1E8] hover:text-amber-400"
                }`}
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-5.5 w-5.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#8C6A43] text-white text-[10px] font-bold shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Desktop Cart Button */}



            {/* Auth Buttons */}
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                {/* User indicator */}
                <div
                  className={`flex items-center gap-1.5 text-sm font-medium ${scrolled ? "text-[#223614]" : "text-[#F7F1E8]/80"
                    }`}
                >
                  <User className="h-4 w-4" />
                  <span className="hidden lg:inline">{user?.name || "Account"}</span>
                </div>
                {/* Logout */}
                <button
                  id="navbar-logout-btn"
                  onClick={handleLogout}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-300 hover:-translate-y-0.5 ${scrolled
                    ? "border-red-200 text-red-500 hover:bg-red-50"
                    : "border-white/30 text-white/90 hover:bg-white/10"
                    }`}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                id="navbar-login-btn"
                href="/login"
                className="flex items-center gap-1.5 bg-gradient-to-r from-[#223614] to-emerald-800 hover:from-emerald-800 hover:to-[#223614] text-[#F7F1E8] px-5 py-2 rounded-full text-sm font-semibold shadow-md hover:shadow-emerald-950/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            )}
            <Link
              href="/products"
              className="bg-gradient-to-r from-[#8C6A43] to-amber-600 hover:from-amber-600 hover:to-[#8C6A43] text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md hover:shadow-amber-900/40 transition-all duration-300 hover:-translate-y-0.5"
            >
              Shop Now
            </Link>

          </div>

          {/* Mobile Right Controls (Cart & Hamburger) */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Mobile Orders Button */}
            <Link
              href="/orders"
              className={`p-2 rounded-xl relative transition-colors ${scrolled ? "text-[#223614]" : "text-white"
                }`}
              aria-label="My Orders"
            >
              <PackageCheck className="h-5.5 w-5.5" />
            </Link>

            <Link
              href="/cart"
              className={`p-2 rounded-xl relative transition-colors ${scrolled ? "text-[#223614]" : "text-white"
                }`}
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-5.5 w-5.5" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#8C6A43] text-white text-[9px] font-bold shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              id="mobile-menu-btn"
              className={`p-2 rounded-lg transition-colors ${scrolled ? "text-[#223614]" : "text-white"
                }`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-6 flex flex-col gap-1.5">
                <span
                  className={`block h-0.5 rounded-full transition-all duration-300 ${scrolled ? "bg-[#223614]" : "bg-white"
                    } ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
                />
                <span
                  className={`block h-0.5 rounded-full transition-all duration-300 ${scrolled ? "bg-[#223614]" : "bg-white"
                    } ${menuOpen ? "opacity-0" : ""}`}
                />
                <span
                  className={`block h-0.5 rounded-full transition-all duration-300 ${scrolled ? "bg-[#223614]" : "bg-white"
                    } ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-96 mt-4" : "max-h-0"
            }`}
        >
          <div className="bg-[#F7F1E8]/95 backdrop-blur-md rounded-2xl p-4 shadow-xl flex flex-col gap-2 border border-[#8C6A43]/10">
            {[{ label: "Home", href: "/" }, ...navItems].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-[#223614] font-medium px-4 py-2.5 rounded-xl hover:bg-[#8C6A43]/10 hover:text-[#8C6A43] transition-colors"
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Menu Cart Link */}
            <Link
              href="/cart"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between text-[#223614] font-medium px-4 py-2.5 rounded-xl hover:bg-[#8C6A43]/10 hover:text-[#8C6A43] transition-colors"
            >
              <span className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-[#223614]/70" />
                Shopping Cart
              </span>
              {cartCount > 0 && (
                <span className="bg-[#8C6A43] text-white px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth section in mobile menu */}
            {isLoggedIn ? (
              <>
                <div className="px-4 py-2 text-xs font-semibold text-gray-400 border-t border-gray-100 mt-1 pt-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {user?.name || "My Account"}
                </div>
                <button
                  id="mobile-logout-btn"
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-500 font-semibold px-4 py-2.5 rounded-xl hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                id="mobile-login-btn"
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#223614] to-emerald-800 text-[#F7F1E8] px-4 py-2.5 rounded-xl font-semibold text-center mt-1"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            )}

            <Link
              href="/products"
              onClick={() => setMenuOpen(false)}
              className="bg-gradient-to-r from-[#8C6A43] to-amber-600 text-white px-4 py-2.5 rounded-xl font-semibold text-center mt-1"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
