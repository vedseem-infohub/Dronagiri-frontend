"use client";

import { Gift, MapPin, MessageCircle, Phone } from "lucide-react";
import Reveal from "./Reveal";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export default function ContactSection() {
  const { settings } = useSiteSettings();

  const whatsappRaw = settings?.whatsappNumber || "+91 99999 99999";
  const whatsappDigits = whatsappRaw.replace(/[^0-9]/g, "");
  const phoneRaw = settings?.phoneNumber || "+91 99999 99999";
  const phoneClean = phoneRaw.replace(/[^0-9+]/g, "");
  const addressText = settings?.address || "Dronagiri, Maharashtra";
  const instagramUrl = settings?.instagramUrl || "https://www.instagram.com/dronagiri_farms";
  const youtubeUrl = settings?.youtubeUrl || "https://youtube.com/@thenitesh1989";

  return (
    <section
      id="contact"
      className="py-20 px-4 bg-[#F7F1E8]"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Reveal>
            <span className="inline-block text-[#8C6A43] text-xs font-bold tracking-[0.3em] uppercase mb-4 border-b-2 border-[#8C6A43]/40 pb-2">
              Enquiries
            </span>
          </Reveal>
          <Reveal>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl font-bold text-[#223614] mb-4">
              Get in <span className="italic text-[#8C6A43]">Touch</span>
            </h2>
          </Reveal>
          <Reveal>
            <p className="text-[#8C6A43] text-lg font-light">
              Have a question? We&apos;re just a message away.
            </p>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <Reveal>
            <div className="space-y-5">
              {/* WhatsApp */}
              <a
                id="contact-whatsapp"
                href={`https://wa.me/${whatsappDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm border border-[#8C6A43]/10 hover:border-[#8C6A43]/40 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#223614]/10 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                  💬
                </div>
                <div>
                  <p className="font-bold text-[#223614]">WhatsApp Orders</p>
                  <p className="text-[#8C6A43] font-medium text-sm">
                    {whatsappRaw}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    Chat with us anytime
                  </p>
                </div>
              </a>

              {/* Phone */}
              <a
                id="contact-phone"
                href={`tel:${phoneClean}`}
                className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm border border-[#8C6A43]/10 hover:border-[#8C6A43]/40 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#8C6A43]/15 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                  📞
                </div>
                <div>
                  <p className="font-bold text-[#223614]">Call Us</p>
                  <p className="text-[#8C6A43] font-medium text-sm">
                    {phoneRaw}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    Mon–Sat, 9am–7pm
                  </p>
                </div>
              </a>

              {/* Location */}
              <div className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm border border-[#8C6A43]/10">
                <div className="w-12 h-12 rounded-xl bg-[#8C6A43]/15 flex items-center justify-center text-2xl shrink-0">
                  🌾
                </div>
                <div>
                  <p className="font-bold text-[#223614]">Our Farm</p>
                  <p className="text-[#8C6A43] font-medium text-sm">
                    {addressText}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    Farm visits welcome
                  </p>
                </div>
              </div>

              {/* Instagram */}
              <a
                id="contact-instagram"
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm border border-[#8C6A43]/10 hover:border-pink-500/40 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-[#223614]">Instagram</p>
                  <p className="text-[#8C6A43] font-medium text-sm">
                    {instagramUrl.replace(/https?:\/\/(www\.)?instagram\.com\/?/, "@").split("?")[0] || "@dronagiri_farms"}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    Follow for farm updates & recipes
                  </p>
                </div>
              </a>

              {/* YouTube */}
              <a
                id="contact-youtube"
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm border border-[#8C6A43]/10 hover:border-red-500/40 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FF0000] flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-[#223614]">YouTube</p>
                  <p className="text-[#8C6A43] font-medium text-sm">
                    {youtubeUrl.replace(/https?:\/\/(www\.)?youtube\.com\/?/, "").split("?")[0] || "@thenitesh1989"}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    Watch farming & journey videos
                  </p>
                </div>
              </a>

              {/* Bulk Orders Note */}
              <div className="flex items-start gap-4 bg-gradient-to-r from-[#223614] to-emerald-800 rounded-2xl p-5 text-white">
                <div className="text-2xl shrink-0">🎁</div>
                <div>
                  <p className="font-bold text-base">Bulk Orders Welcome!</p>
                  <p className="text-green-100 text-sm mt-1">
                    Special discounts available for wholesale and bulk purchases.
                    Contact us to know more.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Quick Order Form */}
          <Reveal>
            <div className="bg-white rounded-3xl p-6 shadow-md border border-[#8C6A43]/10">
              <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#223614] mb-5">
                Quick Order Enquiry
              </h3>
              <form
                id="enquiry-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const name = e.target.name.value;
                  const phone = e.target.phone.value;
                  const msg = e.target.message.value;
                  const waMsg = `Hello! I'm ${name} (${phone}). I'd like to order: ${msg}`;
                  window.open(
                    `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(waMsg)}`,
                    "_blank"
                  );
                }}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="enquiry-name"
                    className="block text-sm font-medium text-[#223614] mb-1.5"
                  >
                    Your Name
                  </label>
                  <input
                    id="enquiry-name"
                    name="name"
                    type="text"
                    required
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#8C6A43] focus:outline-none text-sm transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="enquiry-phone"
                    className="block text-sm font-medium text-[#223614] mb-1.5"
                  >
                    Phone Number
                  </label>
                  <input
                    id="enquiry-phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#8C6A43] focus:outline-none text-sm transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="enquiry-message"
                    className="block text-sm font-medium text-[#223614] mb-1.5"
                  >
                    What would you like to order?
                  </label>
                  <textarea
                    id="enquiry-message"
                    name="message"
                    required
                    rows={4}
                    placeholder="e.g., 1kg Desi Ghee, 5kg Khapli Wheat..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#8C6A43] focus:outline-none text-sm transition-colors resize-none"
                  />
                </div>
                <button
                  id="enquiry-submit"
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#8C6A43] to-amber-600 hover:from-amber-600 hover:to-[#8C6A43] text-white font-bold py-3.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-amber-900/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Send via WhatsApp</span>
                  <span>💬</span>
                </button>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
