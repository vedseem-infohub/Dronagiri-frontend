import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MarqueeStrip from "./components/MarqueeStrip";
import ProductsSection from "./components/ProductsSection";
import WhyUsSection from "./components/WhyUsSection";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BACKEND_URL ||
  process.env.NEXT_API_BACKEND_URL ||
  "https://dronagiri-backend-e4ja.onrender.com";

async function getFeaturedProducts() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/products`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (err) {
    console.error("Error fetching products for Home:", err);
  }
  return [];
}

export default async function Home() {
  const products = await getFeaturedProducts();

  return (
    <>
      <Navbar />
      <main className="flex flex-col flex-1">
        <Hero />
        <MarqueeStrip />
        <ProductsSection initialProducts={products} />
        <WhyUsSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
