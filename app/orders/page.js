"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  PackageCheck,
  ReceiptText,
  ShoppingBag,
  Truck,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductIcon from "../components/ProductIcon";
import { useCart } from "@/context/CartContext";

const formatDate = (value) => {
  if (!value) return "Recently";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const getStatusTone = (status) => {
  if (status === "Order Sent to Admin") {
    return "bg-[#223614]/10 text-[#223614] border-[#223614]/20";
  }

  return "bg-[#8C6A43]/15 text-[#8C6A43] border-[#8C6A43]/20";
};

export default function OrdersPage() {
  const { orders, isLoaded } = useCart();

  return (
    <>
      <Navbar />

      <section className="relative pt-32 pb-16 bg-[#203515] overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-4 animate-fade-in-up">
            <PackageCheck className="h-4 w-4 text-green-400" />
            <span className="text-white/90 text-xs font-semibold tracking-widest uppercase">
              My Orders
            </span>
          </div>
          <h1 className="font-[family-name:var(--font-playfair)] text-white text-4xl sm:text-5xl font-bold mb-2 animate-fade-in-up">
            Order History
          </h1>
          <p className="text-white/60 text-sm sm:text-base font-light max-w-xl mx-auto animate-fade-in-up">
            Track your recent Dronagiri Farm orders saved on this device.
          </p>
        </div>
      </section>

      <main className="flex-1 bg-[#fdfbf7] py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {!isLoaded ? (
            <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 border-4 border-[#8C6A43] border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 font-medium">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-lg px-6 animate-fade-in-up">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#8C6A43]/15 text-[#8C6A43] mb-6 shadow-inner">
                <ReceiptText className="h-10 w-10" />
              </div>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-gray-900 mb-3">
                No Orders Yet
              </h2>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                Your completed checkout orders will appear here after you place
                them from the cart.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#8C6A43] to-amber-600 hover:from-amber-600 hover:to-[#8C6A43] text-white font-semibold px-8 py-3.5 rounded-2xl shadow-md hover:shadow-amber-900/30 transition-all duration-200 hover:-translate-y-0.5"
              >
                <ShoppingBag className="h-5 w-5" />
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#8C6A43] uppercase tracking-widest">
                    {orders.length} saved {orders.length === 1 ? "order" : "orders"}
                  </p>
                  <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-gray-900 mt-1">
                    Recent Purchases
                  </h2>
                </div>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-[#8C6A43] hover:text-amber-700 font-semibold transition-all duration-200 group self-start sm:self-auto"
                >
                  <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Continue shopping
                </Link>
              </div>

              {orders.map((order) => (
                <article
                  key={order.orderId}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-[#223614]/10 text-[#223614] flex items-center justify-center shrink-0">
                        {order.source === "admin" ? (
                          <CheckCircle2 className="h-6 w-6" />
                        ) : (
                          <Clock3 className="h-6 w-6" />
                        )}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-gray-900">
                            {order.orderId}
                          </h3>
                          {/* <span
                            className={`inline-flex items-center border px-2.5 py-1 rounded-full text-[11px] font-bold ${getStatusTone(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span> */}
                        </div>
                        <p className="text-sm text-gray-400 mt-1 flex items-center gap-1.5">
                          <CalendarDays className="h-4 w-4" />
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm lg:min-w-[420px]">
                      <div className="bg-gray-50 rounded-2xl p-3">
                        <p className="text-gray-400 text-xs font-semibold uppercase">
                          Items
                        </p>
                        <p className="text-gray-900 font-bold mt-1">
                          {order.items?.reduce(
                            (total, item) => total + item.count,
                            0
                          ) || 0}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-3">
                        <p className="text-gray-400 text-xs font-semibold uppercase">
                          Payment
                        </p>
                        <p className="text-gray-900 font-bold mt-1 uppercase">
                          {order.paymentMethod || "COD"}
                        </p>
                      </div>
                      <div className="bg-[#223614]/10 rounded-2xl p-3 col-span-2 sm:col-span-1">
                        <p className="text-[#223614]/70 text-xs font-semibold uppercase">
                          Total
                        </p>
                        <p className="text-[#223614] font-black mt-1">
                          Rs. {order.total}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 grid lg:grid-cols-[1fr_280px] gap-6">
                    <div className="flex flex-col gap-3">
                      {order.items?.map((item) => (
                        <div
                          key={`${order.orderId}-${item.product.id}-${item.quantity}`}
                          className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50/50 p-3"
                        >
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#F7F1E8] via-[#fdfbf7] to-amber-50/50 flex items-center justify-center text-[#223614] shrink-0">
                            <ProductIcon
                              product={item.product}
                              className="h-7 w-7"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-gray-900 truncate">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {item.quantity} x {item.count}
                            </p>
                          </div>
                          <p className="text-sm font-bold text-[#223614]">
                            Rs. {item.price * item.count}
                          </p>
                        </div>
                      ))}
                    </div>

                    <aside className="rounded-2xl bg-[#fdfbf7] border border-amber-100 p-4 h-fit">
                      <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                        <Truck className="h-4 w-4 text-[#8C6A43]" />
                        Delivery Details
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-gray-400 text-xs font-semibold uppercase">
                            Recipient
                          </p>
                          <p className="text-gray-800 font-semibold mt-1">
                            {order.customer?.name || "Customer"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs font-semibold uppercase">
                            Phone
                          </p>
                          <p className="text-gray-800 font-semibold mt-1">
                            {order.customer?.phone || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs font-semibold uppercase">
                            Address
                          </p>
                          <p className="text-gray-700 leading-relaxed mt-1">
                            {order.customer?.address || "-"}
                          </p>
                        </div>
                      </div>
                    </aside>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
