export default function MarqueeStrip() {
  const items = [
    "🌾 100% Natural",
    "🌿 No Preservatives",
    "🧑‍🌾 Farmer Direct",
    "🍃 Chemical-Free",
    "💚 Farm Fresh",
    "✨ Premium Quality",
    "🌱 Sustainably Grown",
    "🏡 Home Delivered",
  ];

  return (
    <div className="w-full overflow-hidden bg-gradient-to-r from-green-700 via-green-600 to-lime-600 py-3">
      <div className="flex whitespace-nowrap marquee-track">
        {/* Duplicated to make seamless loop */}
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center text-white/95 font-semibold text-sm tracking-wider mx-8 shrink-0"
          >
            {item}
            <span className="mx-8 w-1.5 h-1.5 rounded-full bg-white/40 inline-block" />
          </span>
        ))}
      </div>
    </div>
  );
}
