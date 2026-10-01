import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductHero from "../components/ProductHero";
import ProductsExplorer from "../components/ProductsExplorer";
import MarqueeStrip from "../components/MarqueeStrip";

export const revalidate = 60;

export const metadata = {
  title: "All Products | Dronagiri Farm",
  description: "Browse all farm-fresh products with category-wise search and filters from Dronagiri Farm.",
};

export default async function ProductsPage() {
  let productsList = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BACKEND_URL ||
      process.env.NEXT_API_BACKEND_URL ||
      "https://dronagiri-backend-e4ja.onrender.com"
      }/api/products`,
      { next: { revalidate: 60 } }
    );
    if (res.ok) {
      productsList = await res.json();
    }
  } catch (err) {
    console.error("Error fetching products:", err);
  }

  const productsToDisplay =
    productsList && productsList.length > 0 ? productsList : [];

  return (
    <>
      <Navbar />
      <ProductHero />
      <MarqueeStrip />
      <main className="flex-1 bg-[#fdfbf7] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ProductsExplorer initialProducts={productsToDisplay} />
        </div>
      </main>
      <Footer />
    </>
  );
}
