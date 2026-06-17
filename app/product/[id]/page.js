import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductDetailClient from "../../components/ProductDetailClient";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { id } = await params;
  
  try {
    const res = await fetch(`http://localhost:8000/api/products/${id}`, { cache: "no-store" });
    if (!res.ok) {
      return {
        title: "Product Not Found | Dronagiri Farm",
      };
    }
    const product = await res.json();
    return {
      title: `${product.name} | Dronagiri Farm`,
      description: product.description || `Buy ${product.name} farm-fresh organic from Dronagiri Farm.`,
    };
  } catch (error) {
    return {
      title: "Dronagiri Farm Products",
    };
  }
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  
  let product = null;
  let allProducts = [];
  
  try {
    // Fetch individual product details
    const productRes = await fetch(`http://localhost:8000/api/products/${id}`, { cache: "no-store" });
    if (productRes.ok) {
      product = await productRes.json();
    }
    
    // Fetch all products to recommend other items in the same category
    const allRes = await fetch(`http://localhost:8000/api/products`, { cache: "no-store" });
    if (allRes.ok) {
      allProducts = await allRes.json();
    }
  } catch (error) {
    console.error("Error fetching product details or recommendations:", error);
  }
  
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
