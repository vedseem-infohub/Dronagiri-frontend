"use client";

import { Gift, MapPin, MessageCircle, Phone } from "lucide-react";
import Reveal from "./Reveal";

export default function ContactSection() {
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
              href="https://wa.me/919999999999"
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
                  +91 99999 99999
                </p>
                <p className="text-gray-400 text-xs mt-0.5">
                  Chat with us anytime
                </p>
              </div>
            </a>

            {/* Phone */}
            <a
              id="contact-phone"
              href="tel:+919999999999"
              className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm border border-[#8C6A43]/10 hover:border-[#8C6A43]/40 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#8C6A43]/15 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                📞
              </div>
              <div>
                <p className="font-bold text-[#223614]">Call Us</p>
                <p className="text-[#8C6A43] font-medium text-sm">
                  +91 99999 99999
                </p>
                <p className="text-gray-400 text-xs mt-0.5">
                  Mon–Sat, 9am–7pm
                </p>
              </div>
            </a>

            {/* Location */}
            <div className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm border border-[#8C6A43]/10">
              <div className="w-12 h-12 rounded-xl bg-[#8C6A43]/15 flex items-center justify-center text-2xl shrink-0">
                📍
              </div>
              <div>
                <p className="font-bold text-[#223614]">Our Farm</p>
                <p className="text-[#8C6A43] font-medium text-sm">
                  Dronagiri, Maharashtra
                </p>
                <p className="text-gray-400 text-xs mt-0.5">
                  Farm visits welcome
                </p>
              </div>
            </div>

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
                  `https://wa.me/919999999999?text=${encodeURIComponent(waMsg)}`,
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
