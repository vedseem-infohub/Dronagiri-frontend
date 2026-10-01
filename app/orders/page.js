"use client";

import { useState, useEffect, useContext } from "react";
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
  X,
  ExternalLink,
  RefreshCw,
  MapPin,
  ChevronRight,
  Download,
  Calendar,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductIcon from "../components/ProductIcon";
import InvoiceModal from "../components/InvoiceModal";
import TrackingTimeline from "../components/TrackingTimeline";
import { useCart } from "@/context/CartContext";
import { userDataContext } from "@/context/UserContext";
import { getStatusConfig } from "@/lib/statusConfig";
import { getTracking, downloadInvoicePdf, formatDisplayDate } from "@/lib/shippingApi";

export default function OrdersPage() {
  const { orders, isLoaded, fetchOrders } = useCart();
  const { serverUrl } = useContext(userDataContext);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Delhivery Tracking Modal State
  const [activeTracking, setActiveTracking] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState("");

  // Invoice Modal State
  const [selectedInvoiceOrderId, setSelectedInvoiceOrderId] = useState(null);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState(null);

  const handleOpenTracking = async (waybill, orderId) => {
    setActiveTracking({ waybill, orderId });
    setTrackingLoading(true);
    setTrackingError("");
    setTrackingData(null);

    try {
      const data = await getTracking(waybill);
      if (data) {
        setTrackingData(data);
      } else {
        setTrackingError("Tracking details are not available yet.");
      }
    } catch (err) {
      console.error("Fetch tracking error:", err);
      setTrackingError("Tracking information is temporarily unavailable. Please try again shortly.");
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleCloseTracking = () => {
    setActiveTracking(null);
    setTrackingData(null);
    setTrackingError("");
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      setDownloadingInvoiceId(orderId);
      await downloadInvoicePdf(orderId);
    } catch (err) {
      console.error("Invoice download error:", err);
      alert("Unable to download invoice at this moment. Please try again.");
    } finally {
      setDownloadingInvoiceId(null);
    }
  };

  useEffect(() => {
    if (!fetchOrders) return;
    const interval = setInterval(async () => {
      setIsRefreshing(true);
      await fetchOrders();
      setIsRefreshing(false);
    }, 20000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

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
            Track your recent Dronagiri Farm purchases and live shipments.
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
                Your completed checkout orders will appear here after you place them from the cart.
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

              {orders.map((order, orderIdx) => {
                const orderIdentifier = order.orderId || order.id || `ORD-${orderIdx + 1}`;
                const waybillNumber = order.waybill || order.shipping?.waybill;
                const customerName = order.customer?.name || order.name || "Customer";
                const customerPhone = order.customer?.phone || order.phone || "-";
                const customerAddress = order.customer?.address || order.address || order.deliveryAddress || "-";
                const orderTotal = Number(order.total || 0);

                const effectiveStatus = order.internalStatus || order.shipping?.status || order.status || "ORDER_CREATED";
                const statusConfig = getStatusConfig(effectiveStatus);

                const paymentStatus = order.paymentStatus || (order.paymentMethod === "online" ? "Paid" : "Pending");
                const paymentMethod = order.paymentMethod ? order.paymentMethod.toUpperCase() : "COD";

                const expectedDelivery = order.shipping?.expectedDeliveryDate || null;

                return (
                  <article
                    key={orderIdentifier}
                    className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  >
                    {/* Header */}
                    <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-[#223614]/10 text-[#223614] flex items-center justify-center shrink-0">
                          {statusConfig.code === "DELIVERED" ? (
                            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                          ) : (
                            <Truck className="h-6 w-6 text-[#8C6A43]" />
                          )}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-gray-900 font-mono text-base">
                              Order #{orderIdentifier}
                            </h3>
                            <span
                              className={`inline-flex items-center border px-2.5 py-0.5 rounded-full text-xs font-bold ${statusConfig.badgeClass}`}
                            >
                              {statusConfig.label}
                            </span>
                            {order.promoCode && (
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono">
                                <span>🎟️</span>
                                <span>{order.promoCode}</span>
                                {order.discountAmount > 0 && (
                                  <span className="text-emerald-600 font-sans font-bold">(-₹{order.discountAmount})</span>
                                )}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5" />
                            Placed on {formatDisplayDate(order.createdAt || order.date)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm lg:min-w-[420px]">
                        <div className="bg-gray-50/80 rounded-2xl p-3">
                          <p className="text-gray-400 text-[10px] font-bold uppercase">
                            Items
                          </p>
                          <p className="text-gray-900 font-bold mt-0.5">
                            {order.items?.reduce(
                              (total, item) => total + (Number(item.count) || Number(item.qty) || 1),
                              0
                            ) || 0}
                          </p>
                        </div>

                        <div className="bg-gray-50/80 rounded-2xl p-3">
                          <p className="text-gray-400 text-[10px] font-bold uppercase">
                            Payment ({paymentMethod})
                          </p>
                          <p
                            className={`text-xs font-bold mt-0.5 ${
                              paymentStatus === "Paid"
                                ? "text-emerald-700"
                                : paymentStatus === "Failed"
                                ? "text-rose-600"
                                : "text-amber-700"
                            }`}
                          >
                            {paymentStatus}
                          </p>
                        </div>

                        <div className="bg-[#223614]/10 rounded-2xl p-3 col-span-2 sm:col-span-1">
                          <p className="text-[#223614]/70 text-[10px] font-bold uppercase">
                            Total
                          </p>
                          <p className="text-[#223614] font-black mt-0.5">
                            ₹{orderTotal.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Body */}
                    <div className="p-5 sm:p-6 grid lg:grid-cols-[1fr_300px] gap-6">
                      {/* Products List */}
                      <div className="flex flex-col gap-3">
                        {order.items?.map((item, itemIdx) => {
                          const productName = item.product?.name || item.name || "Farm Product";
                          const productCount = Number(item.count || item.qty || 1);
                          const productPrice = Number(item.price || 0);
                          const productVariant = item.quantity || item.variant || "Standard";
                          const productObj = item.product || {
                            id: item.productId || itemIdx,
                            name: productName,
                            imageUrl: item.imageUrl || item.product?.imageUrl || "",
                          };

                          return (
                            <div
                              key={`${orderIdentifier}-${productObj.id || itemIdx}-${productVariant}`}
                              className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50/50 p-3"
                            >
                              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#F7F1E8] via-[#fdfbf7] to-amber-50/50 flex items-center justify-center text-[#223614] shrink-0 overflow-hidden">
                                <ProductIcon
                                  product={productObj}
                                  className="h-10 w-10 object-cover"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-bold text-gray-900 truncate text-sm">
                                  {productName}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {productVariant} × {productCount}
                                </p>
                              </div>
                              <p className="text-sm font-bold text-[#223614]">
                                ₹{(productPrice * productCount).toLocaleString("en-IN")}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      {/* Shipment & Actions Sidebar */}
                      <aside className="rounded-2xl bg-[#fdfbf7] border border-amber-100/80 p-4 h-fit space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                            <Truck className="h-3.5 w-3.5 text-[#8C6A43]" />
                            Shipment Info
                          </h4>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            Delhivery Express
                          </span>
                        </div>

                        <div className="space-y-2 text-xs">
                          {waybillNumber ? (
                            <div>
                              <p className="text-gray-400 text-[10px] font-bold uppercase">AWB Number</p>
                              <p className="font-mono font-bold text-gray-900 text-xs mt-0.5">
                                {waybillNumber}
                              </p>
                            </div>
                          ) : (
                            <p className="text-[11px] text-gray-400">
                              Manifest generation in progress
                            </p>
                          )}

                          {expectedDelivery && (
                            <div>
                              <p className="text-gray-400 text-[10px] font-bold uppercase">Expected Delivery</p>
                              <p className="font-semibold text-emerald-800 text-xs mt-0.5 flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-emerald-600" />
                                {formatDisplayDate(expectedDelivery)}
                              </p>
                            </div>
                          )}

                          <div>
                            <p className="text-gray-400 text-[10px] font-bold uppercase">Delivery To</p>
                            <p className="text-gray-800 font-semibold mt-0.5">{customerName}</p>
                            <p className="text-gray-600 text-[11px] truncate mt-0.5">{customerAddress}</p>
                          </div>
                        </div>

                        {/* Card Action Buttons */}
                        <div className="pt-2 border-t border-amber-100 space-y-2">
                          <Link
                            href={`/orders/${encodeURIComponent(orderIdentifier)}`}
                            className="w-full inline-flex items-center justify-center gap-1.5 bg-[#203515] hover:bg-[#2c471d] text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-all shadow-xs"
                          >
                            <span>View Order</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>

                          <div className="flex gap-2">
                            {waybillNumber && (
                              <button
                                onClick={() => handleOpenTracking(waybillNumber, orderIdentifier)}
                                className="flex-1 inline-flex items-center justify-center gap-1 bg-[#8C6A43]/10 hover:bg-[#8C6A43]/20 text-[#8C6A43] font-bold text-[11px] py-2 px-2 rounded-xl transition-colors cursor-pointer"
                              >
                                <Truck className="w-3 h-3" />
                                <span>Track</span>
                              </button>
                            )}

                            <button
                              onClick={() => setSelectedInvoiceOrderId(orderIdentifier)}
                              className="flex-1 inline-flex items-center justify-center gap-1 bg-white hover:bg-amber-50 text-[#8C6A43] border border-amber-200/80 font-bold text-[11px] py-2 px-2 rounded-xl transition-colors cursor-pointer"
                            >
                              <ReceiptText className="w-3 h-3" />
                              <span>Bill Preview</span>
                            </button>
                          </div>

                          <button
                            onClick={() => handleDownloadInvoice(orderIdentifier)}
                            disabled={downloadingInvoiceId === orderIdentifier}
                            className="w-full inline-flex items-center justify-center gap-1.5 text-gray-500 hover:text-gray-900 text-[11px] font-medium py-1 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <Download className="w-3 h-3" />
                            <span>
                              {downloadingInvoiceId === orderIdentifier ? "Downloading PDF..." : "Download Tax Invoice PDF"}
                            </span>
                          </button>
                        </div>
                      </aside>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Quick Live Tracking Modal */}
      {activeTracking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#203515] to-[#2e4c1f] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-green-400">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">Live Shipment Tracking</h3>
                  <p className="text-xs text-white/70 mt-0.5">
                    Order #{activeTracking.orderId}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseTracking}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
              {trackingLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2">
                  <div className="w-8 h-8 border-3 border-[#8C6A43] border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-gray-500">Querying Delhivery logistics network...</p>
                </div>
              ) : trackingError ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900">
                  {trackingError}
                </div>
              ) : trackingData ? (
                <TrackingTimeline
                  status={trackingData.internalStatus}
                  carrierStatus={trackingData.carrierStatus}
                  scans={trackingData.scans}
                  expectedDelivery={trackingData.expectedDeliveryDate}
                  currentLocation={trackingData.currentLocation}
                  waybill={activeTracking.waybill}
                />
              ) : null}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
              <a
                href={`https://www.delhivery.com/track/package/${activeTracking.waybill}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#8C6A43] hover:underline flex items-center gap-1"
              >
                <span>Track on Delhivery</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <Link
                href={`/orders/${encodeURIComponent(activeTracking.orderId)}`}
                className="bg-[#203515] text-white px-3.5 py-1.5 rounded-xl font-bold hover:bg-[#2c471d]"
              >
                Full Order View
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Preview Modal */}
      {selectedInvoiceOrderId && (
        <InvoiceModal
          orderId={selectedInvoiceOrderId}
          open={!!selectedInvoiceOrderId}
          onClose={() => setSelectedInvoiceOrderId(null)}
        />
      )}

      <Footer />
    </>
  );
}
