"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Play } from "lucide-react";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export default function AboutHeroSection() {
  const { settings } = useSiteSettings();
  const heroData = settings?.aboutHero || {};

  const displayImage = heroData.image || "/about-hero.jpg";
  const displayBadge = heroData.badge || "Est. 2018 · Dronagiri Farm";
  const displayHeading =
    heroData.heading || "Bringing Pure Organic Goodness From Farm To Your Family";
  const displayParagraph =
    heroData.paragraph ||
    "From the fertile fields of Dronagiri to your dining table — we nurture every seed with love, tradition, and unwavering commitment to purity.";

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={displayImage}
          alt="Organic farm landscape at golden hour"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Multi-layered overlay for drama */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#223614]/80 via-[#223614]/60 to-[#223614]/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20" />
      </div>

      {/* Floating organic elements */}
      <div className="absolute top-24 left-10 w-2 h-2 rounded-full bg-[#8C6A43]/60 animate-ping" style={{ animationDelay: "0.5s" }} />
      <div className="absolute top-40 right-20 w-1.5 h-1.5 rounded-full bg-[#D9CBB5]/60 animate-ping" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-40 left-20 w-2.5 h-2.5 rounded-full bg-amber-400/40 animate-ping" style={{ animationDelay: "1.5s" }} />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-[#F7F1E8] px-5 py-2.5 rounded-full text-sm font-medium tracking-widest uppercase mb-8"
        >
          <Leaf className="h-4 w-4 text-green-400" />
          {displayBadge}
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="font-[family-name:var(--font-playfair)] text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#F7F1E8] leading-[1.1] mb-8"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-200">
            {displayHeading}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-[#D9CBB5] text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed mb-12 font-light"
        >
          {displayParagraph}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/products"
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#8C6A43] to-amber-600 hover:from-amber-600 hover:to-[#8C6A43] text-white px-8 py-4 rounded-full font-semibold text-base tracking-wide transition-all duration-500 shadow-2xl hover:shadow-amber-900/40 hover:-translate-y-1"
          >
            Shop Our Products
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          <Link
            href="#our-story"
            className="group inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 text-[#F7F1E8] px-8 py-4 rounded-full font-semibold text-base tracking-wide transition-all duration-500 hover:-translate-y-1"
          >
            <Play className="h-4 w-4 fill-current" />
            Our Story
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[#D9CBB5] text-xs tracking-widest uppercase">Scroll to Explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-[#D9CBB5]/60 to-transparent animate-pulse" />
        </motion.div>
      </div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
        className="absolute bottom-0 left-0 right-0 z-20 bg-black/30 backdrop-blur-lg border-t border-white/10"
      >
        <div className="max-w-5xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x divide-white/20">
          {[
            { value: "10,000+", label: "Happy Families" },
            { value: "500+", label: "Partner Farmers" },
            { value: "100+", label: "Pure Products" },
            { value: "50+", label: "Cities Served" },
          ].map((stat) => (
            <div key={stat.label} className="text-center px-4">
              <div className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-amber-400">{stat.value}</div>
              <div className="text-[#D9CBB5] text-xs tracking-wide mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
