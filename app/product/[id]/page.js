import { cache } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductDetailClient from "../../components/ProductDetailClient";
import { notFound } from "next/navigation";

export const revalidate = 60;

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BACKEND_URL ||
  process.env.NEXT_API_BACKEND_URL ||
  "https://dronagiri-backend-e4ja.onrender.com";

const getProduct = cache(async (id) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/products/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
});

const getAllProducts = cache(async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/products`, {
      next: { revalidate: 60 },
    });
    if (res.ok) return await res.json();
  } catch (error) {
    console.error("Error fetching all products for recommendations:", error);
  }
  return [];
});

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Product Not Found | Dronagiri Farm",
    };
  }

  return {
    title: `${product.name} | Dronagiri Farm`,
    description: product.description || `Buy ${product.name} farm-fresh organic from Dronagiri Farm.`,
  };
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;

  const [product, allProducts] = await Promise.all([
    getProduct(id),
    getAllProducts(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Navbar solid={true} />
      <main className="flex-1 bg-[#fdfbf7]">
        <ProductDetailClient product={product} allProducts={allProducts} />
      </main>
      <Footer />
    </>
  );
}

