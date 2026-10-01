"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const DEFAULT_SITE_SETTINGS = {
  logoUrl: "/logo2.png",
  whatsappNumber: "+91 99999 99999",
  phoneNumber: "+91 99999 99999",
  address: "Dronagiri, Maharashtra, India",
  instagramUrl:
    "https://www.instagram.com/dronagiri_farms?stkn=MW56NTE5dWZ0ZWhreg%3D%3D&utm_source=qr",
  youtubeUrl: "https://youtube.com/@thenitesh1989?si=ujvjHrIab8OhW2VG",
  heroSlides: [
    {
      image: "/Artboard 3.png",
      badge: "100% Natural & Organic",
      title1: "Dronagiri",
      title2: "Farm",
      tagline:
        "From our fields to your kitchen — pure, unprocessed, farm-fresh goodness.",
      primaryCtaText: "🛒 Shop Products",
      primaryCtaLink: "/products",
      secondaryCtaText: "Our Story ↓",
      secondaryCtaLink: "/about",
    },
    {
      image: "/Artboard 2.png",
      badge: "Grown Without Chemicals",
      title1: "Purity In",
      title2: "Every Grain",
      tagline:
        "Taste the rich nutritional value of traditional, stone-ground ancient grains and millets.",
      primaryCtaText: "🌾 Explore Grains",
      primaryCtaLink: "/products/wheat-and-grains",
      secondaryCtaText: "Our Methods ↓",
      secondaryCtaLink: "/about#values",
    },
    {
      image: "/Artboard 1.jpeg",
      badge: "Traditional Vedic Method",
      title1: "Pure A2",
      title2: "Desi Ghee",
      tagline:
        "Traditional Bilona hand-churned ghee, packed with rich flavor and vital nutrients.",
      primaryCtaText: "🥛 Browse Oils & Ghee",
      primaryCtaLink: "/products/oils-and-ghee",
      secondaryCtaText: "Health Benefits ↓",
      secondaryCtaLink: "/about#values",
    },
  ],
  founders: [
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
        "Today, Dronagiri Farms is actively working across India, with farming and sourcing initiatives in multiple regions, and has also delivered its products to customers outside India.",
      ],
      quote: "Building a trusted Farm-to-Family brand from India to the world. 🌱🌍",
      youtubeUrl: "https://youtube.com/@thenitesh1989?si=ujvjHrIab8OhW2VG",
      instagramUrl:
        "https://www.instagram.com/dronagiri_farms?stkn=MW56NTE5dWZ0ZWhreg%3D%3D&utm_source=qr",
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
        "Today, he is focused on building Dronagiri Farms into a modern, trusted and farmer-connected Farm-to-Family brand.",
      ],
      quote: "“Bringing Professional Experience to Modern Farming.” 🌱🏗️",
      youtubeUrl: "",
      instagramUrl:
        "https://www.instagram.com/dronagiri_farms?stkn=MW56NTE5dWZ0ZWhreg%3D%3D&utm_source=qr",
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
        "As Co-Founder of Dronagiri Farms, she brings a strong farmer-focused and community-driven perspective to the brand, working towards creating better opportunities and stronger connections between farmers and consumers.",
      ],
      quote: "“Empowering Farmers. Strengthening Communities.” 🌱🤝",
      youtubeUrl: "",
      instagramUrl:
        "https://www.instagram.com/dronagiri_farms?stkn=MW56NTE5dWZ0ZWhreg%3D%3D&utm_source=qr",
    },
  ],
  productsHero: {
    image: "/Artboard 2.png",
    badge: "Dronagiri Farm Products",
    heading: "Farm-Fresh Products",
    paragraph:
      "Pure grains, pulses, spices, oils, and natural staples sourced directly from our farm.",
  },
  aboutHero: {
    image: "/about-hero.jpg",
    badge: "Est. 2018 · Dronagiri Farm",
    heading: "Bringing Pure Organic Goodness From Farm To Your Family",
    paragraph:
      "From the fertile fields of Dronagiri to your dining table — we nurture every seed with love, tradition, and unwavering commitment to purity.",
  },
};

const SiteSettingsContext = createContext({
  settings: DEFAULT_SITE_SETTINGS,
  loading: false,
  refreshSettings: async () => {},
});

export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(false);

  const serverUrl =
    process.env.NEXT_PUBLIC_API_BACKEND_URL ||
    process.env.NEXT_API_BACKEND_URL ||
    "https://dronagiri-backend-e4ja.onrender.com";

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${serverUrl}/api/settings`);
      if (res.data?.success && res.data.settings) {
        setSettings(res.data.settings);
      }
    } catch (err) {
      console.warn("Could not fetch dynamic site settings, using defaults:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        loading,
        refreshSettings: fetchSettings,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
