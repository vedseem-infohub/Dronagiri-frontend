import { ArrowRight, BadgeCheck, Handshake, Heart, Sprout } from "lucide-react";
import Reveal from "./Reveal";

export default function AboutSection() {
  const values = [
    {
      Icon: Sprout,
      title: "Grown with Love",
      desc: "Every crop is nurtured without chemicals, ensuring you get the purest form of nature's bounty.",
    },
    {
      Icon: Handshake,
      title: "Farmer Direct",
      desc: "No middlemen. We harvest and deliver directly to your doorstep, keeping quality intact.",
    },
    {
      Icon: BadgeCheck,
      title: "Quality Assured",
      desc: "Each batch is carefully tested and packed to maintain freshness and nutritional value.",
    },
    {
      Icon: Heart,
      title: "Eco-Conscious",
      desc: "Sustainable farming practices that respect the earth and give back to the environment.",
    },
  ];

  return (
    <section
      id="about"
      className="py-20 px-4 bg-gradient-to-br from-[#223614] via-[#1c2e10] to-[#14220c] relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <Reveal delay={0.1}>
          <div>
            <span className="inline-block text-[#8C6A43] text-xs font-bold tracking-[0.3em] uppercase mb-4 border-b-2 border-[#8C6A43]/40 pb-2">
              About Us
            </span>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl font-bold text-[#F7F1E8] mb-6 leading-tight">
              Straight from the
              <br />
              <span className="shimmer-text">Heart of Dronagiri</span>
            </h2>
            <p className="text-[#D9CBB5] text-lg font-light leading-relaxed mb-6">
              Nestled in the fertile soils of Dronagiri, our farm has been
              producing the finest organic foods for generations. We believe
              that good health begins with what you eat — and what you eat
              should be pure.
            </p>
            <p className="text-white/80 text-base leading-relaxed mb-8">
              From heirloom wheat varieties like Khapli to pure A2 Desi Ghee,
              every product in our range is grown, harvested, and packed with
              care. No preservatives. No artificial colors. Just nature&apos;s
              best.
            </p>
            <a
              id="about-contact-btn"
              href="#contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8C6A43] to-amber-600 hover:from-amber-600 hover:to-[#8C6A43] text-white font-bold px-7 py-3.5 rounded-full transition-all duration-300 hover:-translate-y-0.5 shadow-lg hover:shadow-amber-900/40"
            >
              Get in Touch
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
          </Reveal>

          {/* Right: Values Grid */}
          <Reveal delay={0.3}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-[#8C6A43]/30 transition-all duration-300 hover:-translate-y-1"
              >
                <Icon className="mb-3 h-8 w-8 text-amber-400" aria-hidden="true" />
                <h3 className="text-[#F7F1E8] font-bold text-base mb-2">{title}</h3>
                <p className="text-[#D9CBB5] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
