"use client";

import Link from "next/link";
import Image from "next/image";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export default function Footer() {
  const { settings } = useSiteSettings();

  const logoSrc = settings?.logoUrl || "/logo2.png";
  const whatsapp = settings?.whatsappNumber || "+91 99999 99999";
  const rawWaDigits = whatsapp.replace(/\D/g, "");
  const waLink = rawWaDigits ? `https://wa.me/${rawWaDigits}` : "https://wa.me/919999999999";
  const phone = settings?.phoneNumber || "+91 99999 99999";
  const instagramUrl =
    settings?.instagramUrl ||
    "https://www.instagram.com/dronagiri_farms?stkn=MW56NTE5dWZ0ZWhreg%3D%3D&utm_source=qr";
  const youtubeUrl =
    settings?.youtubeUrl || "https://youtube.com/@thenitesh1989?si=ujvjHrIab8OhW2VG";
  const address = settings?.address || "Dronagiri, Maharashtra, India";

  return (
    <footer className="bg-[#14220c] border-t border-[#8C6A43]/20 text-[#D9CBB5] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div>
                <span className="font-[family-name:var(--font-playfair)] text-white font-bold text-lg block leading-tight">
                  <Image
                    src={logoSrc}
                    alt="logo"
                    width={200}
                    height={200}
                    loading="eager"
                    className="invert"
                    style={{ height: "auto" }}
                  />
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-[#D9CBB5]/70 mb-5">
              Farm-fresh organic products delivered straight from our fields to
              your family&apos;s table.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Dronagiri Farms on Instagram"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-to-tr hover:from-amber-600 hover:via-rose-600 hover:to-purple-600 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-sm"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Subscribe to Dronagiri Farms on YouTube"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#FF0000] flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-sm"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-2 text-sm uppercase tracking-widest font-[family-name:var(--font-playfair)]">
              Quick Links
            </h4>
            <ul className=" gap-y-1 flex flex-col">
              <Link
                href={`/`}
                className="text-sm hover:text-amber-400 transition-colors"
              >
                <li>Home</li>
              </Link>
              <Link
                href={`#contact`}
                className="text-sm hover:text-amber-400 transition-colors"
              >
                <li>Contact</li>
              </Link>

              {["Products", "About Us"].map((link) => (
                <li key={link}>
                  <Link
                    href={`/${link.toLowerCase().replace(" ", "")}`}
                    className="text-sm hover:text-amber-400 transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest font-[family-name:var(--font-playfair)]">
              Categories
            </h4>
            <ul className="space-y-2">
              {["Pulses", "Millets", "Rice", "Wheat & Grains", "Oils & Ghee", "Spices", "Sweeteners"].map(
                (cat) => (
                  <li key={cat}>
                    <Link
                      href="/products"
                      className="text-sm hover:text-amber-400 transition-colors"
                    >
                      {cat}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest font-[family-name:var(--font-playfair)]">
              Contact & Social
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <span>📞</span>
                <Link href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:text-amber-400 transition-colors">
                  {phone}
                </Link>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span>💬</span>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors"
                >
                  WhatsApp: {whatsapp}
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="text-amber-400">📸</span>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <span>Instagram</span>
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="text-red-400">▶️</span>
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <span>YouTube</span>
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span>🌾</span>
                <span>{address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#8C6A43]/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#D9CBB5]/50">
            © {new Date().getFullYear()} Dronagiri Farm. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-[#D9CBB5]/60">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 transition-colors"
            >
              Instagram
            </a>
            <span>•</span>
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 transition-colors"
            >
              YouTube
            </a>
          </div>
          <p className="text-xs text-[#D9CBB5]/50">
            Made with ❤️ &amp; 🌾 for healthy living
          </p>
        </div>
      </div>
    </footer>
  );
}
