import Link from 'next/link'
import Image from "next/image";

export default function Hero() {
  return (
    <section id="home" className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/hero-banner.png"
        alt="Dronagiri Farm – lush organic farmland"
          fill
          preload
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      

       {/* Dark overlay with gradient */}
      <div className="hero-overlay absolute inset-0" />

      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-green-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6 animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-green-400 badge-organic" />
          <span className="text-white/90 text-sm font-medium tracking-widest uppercase">
            100% Natural &amp; Organic
          </span>
        </div>

        {/* Main heading */}
        <h1
          className="font-[family-name:var(--font-playfair)] text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-4"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="block animate-fade-in-up">Dronagiri</span>
          <span
            className="block shimmer-text animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Farm
          </span>
        </h1>

        {/* Tagline */}
        <p
          className="text-white/80 text-lg sm:text-xl md:text-2xl font-light max-w-2xl mb-10 animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          From our fields to your kitchen — pure, unprocessed, farm-fresh goodness
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 animate-fade-in-up"
          style={{ animationDelay: "0.45s" }}
        >
          <Link
            id="hero-shop-btn"
            href="/products"
            className="bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-white font-bold px-8 py-4 rounded-full text-lg shadow-xl hover:shadow-green-500/40 transition-all duration-300 hover:-translate-y-1"
          >
            🛒 Shop Products
          </Link>
          <Link
            id="hero-about-btn"
            href="/about"
            className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 hover:-translate-y-1"
          >
            Our Story ↓
          </Link>
        </div>

        {/* Stats */}
        <div
          className="mt-16 flex gap-8 sm:gap-16 animate-fade-in-up"
          style={{ animationDelay: "0.6s" }}
        >
          {[
            { value: "22+", label: "Products" },
            { value: "100%", label: "Natural" },
            { value: "Farm", label: "Fresh" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white font-[family-name:var(--font-playfair)]">
                {value}
              </div>
              <div className="text-white/60 text-sm uppercase tracking-wider mt-1">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-8 h-12 rounded-full border-2 border-white/40 flex items-start justify-center pt-2">
          <div className="w-1.5 h-3 rounded-full bg-white/60 animate-bounce" />
        </div>
      </div>  */}

          


    </section>
  );
}
