import Link from "next/link";
import Image from "next/image";

export default function Footer() {
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
                    src="/logo2.png"
                    alt="logo"
                    width={200}
                    height={200}
                    loading="eager"
                    className="h-auto invert"
                  />
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-[#D9CBB5]/70">
              Farm-fresh organic products delivered straight from our fields to
              your family&apos;s table.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest font-[family-name:var(--font-playfair)]">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {["Home", "Products", "About Us", "Contact"].map((link) => (
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
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <span>📞</span>
                <Link href="tel:+919999999999" className="hover:text-amber-400 transition-colors">
                  +91 99999 99999
                </Link>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span>💬</span>
                <Link
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors"
                >
                  WhatsApp Us
                </Link>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span>📍</span>
                <span>Dronagiri, Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#8C6A43]/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#D9CBB5]/50">
            © {new Date().getFullYear()} Dronagiri Farm. All rights reserved.
          </p>
          <p className="text-xs text-[#D9CBB5]/50">
            Made with ❤️ &amp; 🌾 for healthy living
          </p>
        </div>
      </div>
    </footer>
  );
}
