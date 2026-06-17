import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductHero from "../components/ProductHero";
import ProductCard from "../components/ProductCard";
import {
  productCategories,
  categoryToSlug,
} from "../data/products";
import MarqueeStrip from "../components/MarqueeStrip";
import Reveal from "../components/Reveal";

export const metadata = {
  title: "All Products | Dronagiri Farm",
  description: "Browse all farm-fresh products from Dronagiri Farm.",
};

export default async function ProductsPage() {
  let productsList = [];
  try {
    const res = await fetch("http://localhost:8000/api/products", { cache: "no-store" });
    if (res.ok) {
      productsList = await res.json();
    }
  } catch (err) {
    console.error("Error fetching products:", err);
  }

  return (
    <>
      <Navbar />
      <ProductHero
        title="All Farm-Fresh Products"
        description="Browse every product grown and sourced directly from our farm."
      />
      <MarqueeStrip />
      <main className="flex-1 bg-[#fdfbf7] py-20 px-4">
        <div className="max-w-7xl mx-auto">

          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {productCategories.map((category, i) => (
              <Reveal key={category} delay={i * 0.1}>
              <Link
                key={category}
                href={`/products/${categoryToSlug(category)}`}
                className="border-2 border-[#8C6A43]/20 text-[#223614]/80 hover:border-[#8C6A43] hover:text-[#8C6A43] bg-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
              >
                {category}
              </Link>
              </Reveal>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productsList.map((product, i) => (
              <Reveal key={product.id} delay={i * 0.1}>
              <ProductCard
                key={product.id}
                product={product}
              />
              </Reveal>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
