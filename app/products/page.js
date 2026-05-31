import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductHero from "../components/ProductHero";
import ProductCard from "../components/ProductCard";
import {
  products,
  productCategories,
  categoryToSlug,
} from "../data/products";
import MarqueeStrip from "../components/MarqueeStrip";

export const metadata = {
  title: "All Products | Dronagiri Farm",
  description: "Browse all farm-fresh products from Dronagiri Farm.",
};

export default function ProductsPage() {
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
            {productCategories.map((category) => (
              <Link
                key={category}
                href={`/products/${categoryToSlug(category)}`}
                className="border-2 border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-600 bg-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
              >
                {category}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
