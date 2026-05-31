import Image from "next/image";

export default function ProductHero({
  eyebrow = "Dronagiri Farm Products",
  title = "Farm-Fresh Products",
  description = "Pure grains, pulses, spices, oils, and natural staples sourced directly from our farm.",
}) {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#203515]">
      <Image
        src="/Artboard 1.jpeg"
        alt="Dronagiri Farm product collection"
        fill
        preload
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="hero-overlay absolute inset-0" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6 animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-green-400 badge-organic" />
          <span className="text-white/90 text-sm font-medium tracking-widest uppercase">
            {eyebrow}
          </span>
        </div>
        <h1 className="font-[family-name:var(--font-playfair)] text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-4 animate-fade-in-up">
          {title}
        </h1>
        <p
          className="text-white/80 text-lg sm:text-xl md:text-2xl font-light max-w-2xl animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          {description}
        </p>
      </div>
    </section>
  );
}
