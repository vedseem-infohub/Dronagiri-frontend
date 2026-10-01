"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Quote, MapPin, Award } from "lucide-react";
import { useSiteSettings } from "@/context/SiteSettingsContext";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const DEFAULT_FOUNDERS = [
  {
    name: "Nitesh Bhasney",
    role: "Founder",
    title: "Founder, Dronagiri Farms",
    qualification: "Civil Engineer & Farmer",
    location: "Based in Noida · Started in Jhansi",
    image: "/niteshBhasney.jpg",
    badgeClass: "bg-[#223614] text-[#F7F1E8]",
    paragraphs: [
      "Based in Noida, Nitesh Bhasney is a Civil Engineer and Farmer who started his farming journey in Jhansi. With a vision to connect farmers, farms and families, he founded Dronagiri Farms.",
      "Today, Dronagiri Farms is actively working across India, with farming and sourcing initiatives in multiple regions, and has also delivered its products to customers outside India."
    ],
    quote: "Building a trusted Farm-to-Family brand from India to the world. 🌱🌍",
    socials: [
      {
        name: "YouTube",
        url: "https://youtube.com/@thenitesh1989?si=ujvjHrIab8OhW2VG",
        label: "Watch on YouTube",
        type: "youtube",
      },
      {
        name: "Instagram",
        url: "https://www.instagram.com/dronagiri_farms?stkn=MW56NTE5dWZ0ZWhreg%3D%3D&utm_source=qr",
        label: "@dronagiri_farms",
        type: "instagram",
      },
    ],
  },
  {
    name: "Shripad Indapurkar",
    role: "Co-Founder",
    title: "Co-Founder, Dronagiri Farms",
    qualification: "Civil Engineer",
    location: "Based in Noida",
    image: "/ShripadIndapurkar.jpg",
    badgeClass: "bg-[#8C6A43] text-white",
    paragraphs: [
      "Based in Noida, Shripad Indapurkar is a Civil Engineer with extensive corporate experience, having worked with leading companies and reached General Manager (GM) level in his professional career.",
      "With a deep interest and passion for farming and agriculture, he decided to bring his professional experience and passion for farming together, contributing to the creation and growth of Dronagiri Farms.",
      "Today, he is focused on building Dronagiri Farms into a modern, trusted and farmer-connected Farm-to-Family brand."
    ],
    quote: "“Bringing Professional Experience to Modern Farming.” 🌱🏗️",
    socials: [
      {
        name: "Instagram",
        url: "https://www.instagram.com/dronagiri_farms?stkn=MW56NTE5dWZ0ZWhreg%3D%3D&utm_source=qr",
        label: "@dronagiri_farms",
        type: "instagram",
      },
    ],
  },
  {
    name: "Seema Bhasney",
    role: "Co-Founder",
    title: "Co-Founder, Dronagiri Farms",
    qualification: "LLB",
    location: "Based in Jhansi",
    image: "/SeemaBhasney.jpg",
    badgeClass: "bg-[#8C6A43] text-white",
    paragraphs: [
      "Based in Jhansi, Seema Bhasney is an LLB professional and socially active entrepreneur with a strong connection to rural communities and farmers. Through her social work and public engagement, she has worked to support farmers and help them understand and access their rights and opportunities.",
      "As Co-Founder of Dronagiri Farms, she brings a strong farmer-focused and community-driven perspective to the brand, working towards creating better opportunities and stronger connections between farmers and consumers."
    ],
    quote: "“Empowering Farmers. Strengthening Communities.” 🌱🤝",
    socials: [
      {
        name: "Instagram",
        url: "https://www.instagram.com/dronagiri_farms?stkn=MW56NTE5dWZ0ZWhreg%3D%3D&utm_source=qr",
        label: "@dronagiri_farms",
        type: "instagram",
      },
    ],
  },
];

export default function OurStorySection() {
  const { settings } = useSiteSettings();

  const founders = (settings?.founders && settings.founders.length > 0)
    ? settings.founders.map((f) => ({
        ...f,
        socials: [
          ...(f.youtubeUrl
            ? [{ name: "YouTube", url: f.youtubeUrl, label: "Watch on YouTube", type: "youtube" }]
            : []),
          ...(f.instagramUrl
            ? [{ name: "Instagram", url: f.instagramUrl, label: "@dronagiri_farms", type: "instagram" }]
            : []),
        ],
      }))
    : DEFAULT_FOUNDERS;

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="our-story" ref={ref} className="bg-[#F7F1E8] py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header: Our Journey */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <span className="inline-block text-[#8C6A43] text-xs font-bold tracking-[0.3em] uppercase mb-4 border-b-2 border-[#8C6A43]/40 pb-2">
            Our Journey & Purpose
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl lg:text-6xl font-bold text-[#223614] leading-tight max-w-4xl mx-auto">
            Connecting <span className="italic text-[#8C6A43]">Farmers, Farms</span> & Families
          </h2>
          <p className="mt-6 text-[#8C6A43] text-lg max-w-3xl mx-auto font-medium leading-relaxed">
            Dronagiri Farms is driven by a shared commitment to pure food, rural empowerment, and sustainable agriculture — built from the ground up to bring genuine farm-fresh goodness to every doorstep.
          </p>
        </motion.div>

        {/* Brand Values & Story Highlights */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 lg:p-10 border border-[#8C6A43]/15 shadow-sm mb-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2 text-[#8C6A43] font-semibold text-sm">
                <Award className="w-5 h-5" />
                <span>Our Founding Mission</span>
              </div>
              <p className="text-gray-700 text-base leading-relaxed">
                Founded with a deep respect for natural farming and the hands that cultivate our land, Dronagiri Farms began in Jhansi and has grown into a dynamic network across multiple agricultural belts of India. We combine ancestral soil wisdom with professional supply standards to ensure purity, authenticity, and fair returns for our farming partners.
              </p>
              <div className="flex flex-wrap gap-2.5 pt-2">
                {[
                  "100% Farm-Direct",
                  "Farmer Empowerment",
                  "No Preservatives",
                  "Zero Chemical Shortcuts",
                  "Pan-India Reach",
                  "Global Deliveries"
                ].map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#223614]/8 text-[#223614] border border-[#223614]/15 px-3.5 py-1.5 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Milestones Box */}
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-3 border-t lg:border-t-0 lg:border-l border-gray-200 pt-6 lg:pt-0 lg:pl-8">
              <div className="text-center lg:text-left p-3 rounded-2xl bg-[#F7F1E8]/70">
                <div className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#8C6A43]">Jhansi</div>
                <div className="text-xs text-gray-600 font-medium">Roots & First Harvest</div>
              </div>
              <div className="text-center lg:text-left p-3 rounded-2xl bg-[#F7F1E8]/70">
                <div className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#223614]">Pan-India</div>
                <div className="text-xs text-gray-600 font-medium">Active Farming Hubs</div>
              </div>
              <div className="text-center lg:text-left p-3 rounded-2xl bg-[#F7F1E8]/70">
                <div className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#8C6A43]">Global</div>
                <div className="text-xs text-gray-600 font-medium">Delivered Internationally</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section Subheader: Meet the Founders */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-14"
        >
          <span className="inline-block text-[#8C6A43] text-xs font-bold tracking-[0.3em] uppercase mb-3 border-b border-[#8C6A43]/30 pb-1.5">
            The Visionaries
          </span>
          <h3 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#223614]">
            Meet Our Founders
          </h3>
          <p className="mt-3 text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Bringing professional engineering, legal empowerment, and genuine agricultural roots together to build India&apos;s trusted Farm-to-Family brand.
          </p>
        </motion.div>

        {/* Three Founders Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {founders.map((founder, idx) => (
            <motion.div
              key={founder.name}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: idx * 0.18, ease: "easeOut" }}
              className="bg-white rounded-3xl overflow-hidden shadow-lg border border-[#8C6A43]/15 flex flex-col group hover:shadow-2xl transition-all duration-300"
            >
              {/* Image Section */}
              <div className="relative overflow-hidden h-80 bg-gradient-to-b from-[#F7F1E8] to-amber-50/50">
                <Image
                  src={founder.image}
                  alt={founder.name}
                  width={500}
                  height={600}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                {/* Gradient vignette at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Role Badge */}
                <span
                  className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full shadow-md uppercase tracking-wider ${founder.badgeClass}`}
                >
                  {founder.role}
                </span>

                {/* Name & Title on top of gradient for visual impact */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h4 className="font-[family-name:var(--font-playfair)] text-2xl font-bold leading-tight drop-shadow-md">
                    {founder.name}
                  </h4>
                  <p className="text-amber-200 text-xs font-medium mt-0.5 drop-shadow">
                    {founder.title}
                  </p>
                </div>
              </div>

              {/* Bio & Details Body */}
              <div className="p-6 sm:p-7 flex flex-col flex-1">
                {/* Meta details */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-gray-100 text-xs">
                  <span className="font-semibold text-[#8C6A43] bg-[#8C6A43]/10 px-2.5 py-1 rounded-lg">
                    {founder.qualification}
                  </span>
                  <span className="text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#8C6A43]" />
                    {founder.location}
                  </span>
                </div>

                {/* Paragraphs */}
                <div className="space-y-3.5 text-gray-600 text-sm leading-relaxed flex-1">
                  {founder.paragraphs.map((para, pIdx) => (
                    <p key={pIdx}>
                      {para}
                    </p>
                  ))}
                </div>

                {/* Social Connect Buttons */}
                {founder.socials && founder.socials.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-4 mt-auto">
                    {founder.socials.map((soc) => (
                      <a
                        key={soc.name}
                        href={soc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all duration-300 hover:shadow-sm hover:-translate-y-0.5 ${
                          soc.type === "youtube"
                            ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                            : "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100"
                        }`}
                      >
                        {soc.type === "youtube" ? (
                          <svg className="w-3.5 h-3.5 fill-red-600 shrink-0" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 fill-pink-600 shrink-0" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                        )}
                        <span>{soc.label}</span>
                      </a>
                    ))}
                  </div>
                )}

                {/* Quote Callout Box */}
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <div className="relative bg-[#F7F1E8]/80 rounded-2xl p-4 border border-[#8C6A43]/15">
                    <Quote className="h-5 w-5 text-[#8C6A43]/40 absolute top-2 right-3" />
                    <p className="font-[family-name:var(--font-playfair)] italic text-sm text-[#223614] font-semibold leading-snug pr-4">
                      {founder.quote}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

