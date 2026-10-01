"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { MapPin, Star, Leaf } from "lucide-react";

const farmers = [
  {
    name: "Savitri Devi",
    location: "Nashik, Maharashtra",
    specialty: "Organic Onions & Wheat",
    years: "12 years farming",
    image: "/farmer1.jpg",
    crops: ["Wheat", "Onions", "Maize"],
    story: "Savitri transformed her 5-acre plot into a thriving organic farm after joining our cooperative in 2019.",
    rating: 4.9,
  },
  {
    name: "Manoj Chaudhari",
    location: "Pune, Maharashtra",
    specialty: "Pulses & Millets",
    years: "8 years farming",
    image: "/farmer2.jpg",
    crops: ["Moong", "Ragi", "Bajra"],
    story: "Manoj is pioneering ancient millet cultivation in his region, reviving heritage crops for modern wellness.",
    rating: 5.0,
  },
  {
    name: "Bhagwan Rao",
    location: "Ahmednagar, Maharashtra",
    specialty: "Spices & Honey",
    years: "20 years farming",
    image: "/farmer3.jpg",
    crops: ["Turmeric", "Coriander", "Honey"],
    story: "Bhagwan's beekeeping tradition, passed from his grandfather, produces the purest raw forest honey.",
    rating: 4.8,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 70 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.2, ease: "easeOut" },
  }),
};

export default function FarmersSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-[#F7F1E8] py-28 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-[#8C6A43] text-xs font-bold tracking-[0.3em] uppercase mb-4 border-b-2 border-[#8C6A43]/40 pb-2">
            The Faces Behind Your Food
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-5xl lg:text-6xl font-bold text-[#223614] leading-tight">
            Meet Our{" "}
            <span className="italic text-[#8C6A43]">Farmers</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mt-6 leading-relaxed">
            Real farmers. Real stories. Every product you buy directly supports these incredible families.
          </p>
        </motion.div>

        {/* Farmer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {farmers.map((farmer, i) => (
            <motion.div
              key={farmer.name}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-4"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-72">
                <Image
                  src={farmer.image}
                  alt={`${farmer.name} - Farmer at Dronagiri`}
                  fill
                  className="object-cover object-top group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#223614]/80 via-[#223614]/20 to-transparent" />

                {/* Circular name badge overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-white">
                        {farmer.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <MapPin className="h-3.5 w-3.5 text-amber-400" />
                        <span className="text-[#D9CBB5] text-xs">{farmer.location}</span>
                      </div>
                    </div>
                    {/* Rating badge */}
                    <div className="flex items-center gap-1 bg-amber-500 text-white px-2.5 py-1 rounded-full">
                      <Star className="h-3 w-3 fill-white" />
                      <span className="text-xs font-bold">{farmer.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Specialty */}
                <div className="flex items-center gap-2 mb-4">
                  <Leaf className="h-4 w-4 text-[#223614]" />
                  <span className="text-[#223614] font-semibold text-sm">{farmer.specialty}</span>
                  <span className="ml-auto text-gray-400 text-xs">{farmer.years}</span>
                </div>

                {/* Story */}
                <p className="text-gray-600 text-sm leading-relaxed mb-5">{farmer.story}</p>

                {/* Crop tags */}
                <div className="flex flex-wrap gap-2">
                  {farmer.crops.map((crop) => (
                    <span
                      key={crop}
                      className="bg-[#223614]/8 text-[#223614] border border-[#223614]/15 text-xs px-3 py-1 rounded-full font-medium"
                    >
                      {crop}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover bottom accent */}
              <div className="h-1 bg-gradient-to-r from-[#223614] to-[#8C6A43] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </motion.div>
          ))}
        </div>

        {/* All Farmers CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-14"
        >
          <p className="text-gray-500 mb-4">
            … and <strong className="text-[#223614]">500+ more farmer heroes</strong> across Maharashtra
          </p>
          {/* <a
            href="/contact"
            className="inline-flex items-center gap-2 border-2 border-[#223614] text-[#223614] hover:bg-[#223614] hover:text-white px-8 py-3.5 rounded-full font-semibold transition-all duration-300 text-sm tracking-wide"
          >
            Become a Partner Farmer
          </a> */}
        </motion.div>
      </div>
    </section>
  );
}
