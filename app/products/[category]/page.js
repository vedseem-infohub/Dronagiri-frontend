import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductHero from "../../components/ProductHero";
import ProductCard from "../../components/ProductCard";

export const revalidate = 60;

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BACKEND_URL ||
  process.env.NEXT_API_BACKEND_URL ||
  "https://dronagiri-backend-e4ja.onrender.com";

export function categoryToSlug(category) {
  return String(category || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function fetchAllCategories() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/categories`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch (err) {
    console.error("Error fetching categories from database:", err);
  }
  return [];
}

function resolveCategoryName(slug, categories = []) {
  const cleanSlug = String(slug || "").toLowerCase().trim();
  const matched = categories.find(
    (c) =>
      (c.slug && c.slug.toLowerCase() === cleanSlug) ||
      categoryToSlug(c.name) === cleanSlug ||
      c.name.toLowerCase() === cleanSlug
  );

  if (matched) return matched.name;

  // Fallback: title-case the slug
  return cleanSlug
    .replace(/-/g, " ")
    .replace(/\band\b/g, "&")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }) {
  const { category: slug } = await params;
  const categories = await fetchAllCategories();
  const category = resolveCategoryName(slug, categories);

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
  const categories = await fetchAllCategories();
  const category = resolveCategoryName(slug, categories);

  if (!category) {
    notFound();
  }

  let categoryProducts = [];
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/products?category=${encodeURIComponent(category)}`,
      { next: { revalidate: 60 } }
    );
    if (res.ok) {
      categoryProducts = await res.json();
    }
  } catch (err) {
    console.error("Error fetching category products:", err);
  }

  const categoryNames = categories.map((c) => c.name);

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
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            <Link
              href="/products"
              className="border-2 border-[#8C6A43]/20 text-[#223614]/80 hover:border-[#8C6A43] hover:text-[#8C6A43] bg-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm"
            >
              All Products
            </Link>
            {categoryNames.map((item) => (
              <Link
                key={item}
                href={`/products/${categoryToSlug(item)}`}
                className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-200 ${
                  item.toLowerCase() === category.toLowerCase()
                    ? "bg-[#223614] border-[#223614] text-[#F7F1E8] shadow-md"
                    : "border-[#8C6A43]/20 text-[#223614]/80 hover:border-[#8C6A43] hover:text-[#8C6A43] bg-white shadow-sm"
                }`}
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Products Grid or Empty State */}
          {categoryProducts.length === 0 ? (
            <div className="text-center py-16 px-6 bg-white rounded-3xl border border-[#223614]/10 shadow-sm max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#223614]/10 flex items-center justify-center text-[#223614] text-2xl font-bold">
                🌾
              </div>
              <h3 className="text-xl font-bold text-[#223614] mb-2">
                No Products Found
              </h3>
              <p className="text-sm text-[#223614]/70 mb-6">
                There are currently no products listed under{" "}
                <span className="font-semibold text-[#223614]">{category}</span>.
              </p>
              <Link
                href="/products"
                className="inline-block bg-[#223614] hover:bg-[#2c451a] text-[#F7F1E8] font-semibold px-6 py-2.5 rounded-full text-sm transition-colors shadow-sm"
              >
                Browse All Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoryProducts.map((product) => (
                <ProductCard
                  key={product.id || product._id}
                  product={product}
                  orderHref="/#contact"
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
