import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MarqueeStrip from "./components/MarqueeStrip";
import ProductsSection from "./components/ProductsSection";
import WhyUsSection from "./components/WhyUsSection";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col flex-1">
        <Hero />
        <MarqueeStrip />
        <ProductsSection />
        <WhyUsSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
