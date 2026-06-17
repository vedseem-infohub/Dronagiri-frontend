import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductHero from "../../components/ProductHero";
import ProductCard from "../../components/ProductCard";
import {
  productCategories,
  categoryToSlug,
  slugToCategory,
} from "../../data/products";

export function generateStaticParams() {
  return productCategories.map((category) => ({
    category: categoryToSlug(category),
  }));
}

export async function generateMetadata({ params }) {
  const { category: slug } = await params;
  const category = slugToCategory(slug);

  if (!category) {
    return {
      title: "Products | Dronagiri Farm",
    };
  }

  return {
    title: `${category} | Dronagiri Farm`,
    description: `Browse ${category} products from Dronagiri Farm.`,
  };
}

export default async function CategoryProductsPage({ params }) {
  const { category: slug } = await params;
  const category = slugToCategory(slug);

  if (!category) {
    notFound();
  }

  let categoryProducts = [];
  try {
    const res = await fetch(`http://localhost:8000/api/products?category=${encodeURIComponent(category)}`, { cache: "no-store" });
    if (res.ok) {
      categoryProducts = await res.json();
    }
  } catch (err) {
    console.error("Error fetching category products:", err);
  }

  return (
    <>
      <Navbar />
      <ProductHero
        eyebrow="Product Category"
        title={category}
        description={`Explore our farm-fresh ${category.toLowerCase()} collection.`}
      />
      <main className="flex-1 bg-[#fdfbf7] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            <Link
              href="/products"
              className="border-2 border-[#8C6A43]/20 text-[#223614]/80 hover:border-[#8C6A43] hover:text-[#8C6A43] bg-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
            >
              All Products 
            </Link>
            {productCategories.map((item) => (
              <Link
                key={item}
                href={`/products/${categoryToSlug(item)}`}
                className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-200 ${
                  item === category
                    ? "bg-[#223614] border-[#223614] text-[#F7F1E8] shadow-md"
                    : "border-[#8C6A43]/20 text-[#223614]/80 hover:border-[#8C6A43] hover:text-[#8C6A43] bg-white"
                }`}
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                orderHref="/#contact"
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
