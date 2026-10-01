"use client";

import Image from "next/image";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export default function ProductHero({
  eyebrow,
  title,
  description,
  image,
}) {
  const { settings } = useSiteSettings();
  const heroData = settings?.productsHero || {};

  const displayImage = image || heroData.image || "/Artboard 2.png";
  const displayEyebrow = eyebrow || heroData.badge || "Dronagiri Farm Products";
  const displayTitle = title || heroData.heading || "Farm-Fresh Products";
  const displayDesc =
    description ||
    heroData.paragraph ||
    "Pure grains, pulses, spices, oils, and natural staples sourced directly from our farm.";

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#203515]">
      <Image
        src={displayImage}
        alt={`${displayTitle} - Dronagiri Farm`}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="hero-overlay absolute inset-0" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6 animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-amber-400 badge-organic" />
          <span className="text-[#F7F1E8] text-sm font-medium tracking-widest uppercase">
            {displayEyebrow}
          </span>
        </div>
        <h1 className="font-[family-name:var(--font-playfair)] text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-4 animate-fade-in-up">
          {displayTitle}
        </h1>
        <p
          className="text-[#D9CBB5] text-lg sm:text-xl md:text-2xl font-light max-w-2xl animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          {displayDesc}
        </p>
      </div>
    </section>
  );
}
