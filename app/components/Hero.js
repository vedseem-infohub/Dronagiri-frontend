"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "/Artboard 3.png",
    alt: "Dronagiri Farm - Lush Organic Farmland and Premium Products",
    badge: "100% Natural & Organic",
    title1: "Dronagiri",
    title2: "Farm",
    tagline: "From our fields to your kitchen — pure, unprocessed, farm-fresh goodness.",
    primaryCta: { text: "🛒 Shop Products", href: "/products" },
    secondaryCta: { text: "Our Story ↓", href: "/about" },
    stats: [
      { value: "22+", label: "Products" },
      { value: "100%", label: "Natural" },
      { value: "Farm", label: "Fresh" },
    ],
  },
  {
    image: "/Artboard 2.png",
    alt: "Dronagiri Farm - Chemical-Free Grains and Crops",
    badge: "Grown Without Chemicals",
    title1: "Purity In",
    title2: "Every Grain",
    tagline: "Taste the rich nutritional value of traditional, stone-ground ancient grains and millets.",
    primaryCta: { text: "🌾 Explore Grains", href: "/products/wheat-and-grains" },
    secondaryCta: { text: "Our Methods ↓", href: "/about#values" },
    stats: [
      { value: "100%", label: "Chemical Free" },
      { value: "Direct", label: "From Farmers" },
      { value: "Premium", label: "Quality" },
    ],
  },
  {
    image: "/Artboard 1.jpeg",
    alt: "Dronagiri Farm - Pure Hand-Churned A2 Desi Ghee",
    badge: "Traditional Vedic Method",
    title1: "Pure A2",
    title2: "Desi Ghee",
    tagline: "Traditional Bilona hand-churned ghee, packed with rich flavor and vital nutrients.",
    primaryCta: { text: "🥛 Browse Oils & Ghee", href: "/products/oils-and-ghee" },
    secondaryCta: { text: "Health Benefits ↓", href: "/about#values" },
    stats: [
      { value: "A2", label: "Desi Ghee" },
      { value: "Zero", label: "Preservatives" },
      { value: "Pure", label: "Aroma" },
    ],
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Auto-slide transition every 6 seconds
  useEffect(() => {
    if (!isAutoplay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoplay]);

  const nextSlide = () => {
    setIsAutoplay(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIsAutoplay(false);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setIsAutoplay(false);
    setCurrentSlide(index);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    // Reset touch coordinates
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <section
      id="home"
      className="relative w-full h-screen overflow-hidden bg-black"
      onMouseEnter={() => setIsAutoplay(false)}
      onMouseLeave={() => setIsAutoplay(true)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Images with Cross-fade & Zoom Effect */}
      {slides.map((slide, index) => (
        <div
          key={slide.image}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide
            ? "opacity-100 scale-100 z-0"
            : "opacity-0 scale-105 -z-10 pointer-events-none"
            }`}
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      ))}

      {/* Dark overlay with gradient */}
      <div className="hero-overlay absolute inset-0 z-10" />

      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-green-500/10 blur-3xl pointer-events-none z-10 animate-pulse duration-[6000ms]" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none z-10 animate-pulse duration-[8000ms]" />

      {/* Content Container (Key forces re-rendering of animation on slide change) */}
      <div
        key={currentSlide}
        className="relative z-20 h-full flex flex-col items-center justify-center px-4 text-center max-w-5xl mx-auto"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-6 animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-amber-400 badge-organic" />
          <span className="text-[#F7F1E8] text-xs sm:text-sm font-semibold tracking-widest uppercase">
            {slides[currentSlide].badge}
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="font-[family-name:var(--font-playfair)] text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-4 select-none">
          <span className="block animate-fade-in-up">{slides[currentSlide].title1}</span>
          <span
            className="block shimmer-text animate-fade-in-up"
            style={{ animationDelay: "0.15s" }}
          >
            {slides[currentSlide].title2}
          </span>
        </h1>

        {/* Tagline */}
        <p
          className="text-[#D9CBB5] text-base sm:text-lg md:text-xl font-light max-w-2xl mb-10 animate-fade-in-up select-none"
          style={{ animationDelay: "0.3s" }}
        >
          {slides[currentSlide].tagline}
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 animate-fade-in-up"
          style={{ animationDelay: "0.45s" }}
        >
          <Link
            id={`hero-shop-btn-${currentSlide}`}
            href={slides[currentSlide].primaryCta.href}
            className="bg-gradient-to-r from-[#8C6A43] to-amber-600 hover:from-amber-600 hover:to-[#8C6A43] text-white font-bold px-8 py-4 rounded-full text-base sm:text-lg shadow-xl hover:shadow-amber-900/40 transition-all duration-300 hover:-translate-y-1 active:translate-y-0 text-center"
          >
            {slides[currentSlide].primaryCta.text}
          </Link>
          <Link
            id={`hero-about-btn-${currentSlide}`}
            href={slides[currentSlide].secondaryCta.href}
            className="bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-4 rounded-full text-base sm:text-lg transition-all duration-300 hover:-translate-y-1 active:translate-y-0 text-center"
          >
            {slides[currentSlide].secondaryCta.text}
          </Link>
        </div>

        {/* Stats */}
        <div
          className="mt-16 flex gap-8 sm:gap-16 animate-fade-in-up"
          style={{ animationDelay: "0.6s" }}
        >
          {slides[currentSlide].stats.map(({ value, label }) => (
            <div key={label} className="text-center select-none">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-400 font-[family-name:var(--font-playfair)]">
                {value}
              </div>
              <div className="text-[#D9CBB5] text-xs sm:text-sm uppercase tracking-wider mt-1 font-medium">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide Navigation Buttons */}
      {/* <button
        onClick={prevSlide}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3.5 rounded-full bg-white/5 hover:bg-white/15 backdrop-blur-md border border-white/10 hover:border-white/25 text-white/70 hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 group flex items-center justify-center cursor-pointer shadow-lg"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 group-hover:-translate-x-0.5" />
      </button> */}

      {/* <button
        onClick={nextSlide}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3.5 rounded-full bg-white/5 hover:bg-white/15 backdrop-blur-md border border-white/10 hover:border-white/25 text-white/70 hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 group flex items-center justify-center cursor-pointer shadow-lg"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 group-hover:translate-x-0.5" />
      </button> */}

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-500 cursor-pointer shadow-sm ${index === currentSlide
              ? "w-8 bg-[#8C6A43]"
              : "w-2 bg-white/30 hover:bg-white/60"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
