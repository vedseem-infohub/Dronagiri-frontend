import Reveal from "./Reveal";

export default function WhyUsSection() {
  const features = [
    { icon: "🌿", title: "No Chemicals", desc: "Zero pesticides or synthetic fertilizers used at any stage of farming." },
    { icon: "🚜", title: "Traditional Methods", desc: "We combine traditional farming wisdom with modern hygiene standards." },
    { icon: "📦", title: "Hygienic Packaging", desc: "Packed in food-safe, moisture-proof packaging to preserve freshness." },
    { icon: "🏷️", title: "Transparent Pricing", desc: "Direct farm prices — no hidden costs, no markup from middlemen." },
    { icon: "🚚", title: "Home Delivery", desc: "Fresh from our farm to your doorstep anywhere across India." },
    { icon: "📞", title: "Personal Support", desc: "Talk directly with our farm team for any queries or bulk orders." },
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <Reveal>
          <span className="inline-block text-xs font-bold tracking-widest text-green-600 uppercase bg-green-100 px-4 py-1.5 rounded-full mb-4">
            Why Choose Us
          </span>
          </Reveal>
          <Reveal>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            The Dronagiri Difference
          </h2>
          </Reveal>
          <Reveal>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            We don&apos;t just sell food — we deliver trust, tradition, and transparency.
          </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 0.1}>
            <div
              key={title}
              className="group p-6 rounded-2xl border-2 border-gray-100 hover:border-green-200 hover:bg-green-50/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-100 to-lime-100 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {icon}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
