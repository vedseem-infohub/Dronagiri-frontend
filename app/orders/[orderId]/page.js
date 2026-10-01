"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  Package,
  Truck,
  RefreshCw,
  ReceiptText,
  CreditCard,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Building2,
  Phone,
  AlertCircle,
  HelpCircle,
  Download,
} from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ProductIcon from "@/app/components/ProductIcon";
import TrackingTimeline from "@/app/components/TrackingTimeline";
import InvoiceModal from "@/app/components/InvoiceModal";
import { getOrder, getTracking, downloadInvoicePdf, formatDisplayDate, formatDisplayDateTime } from "@/lib/shippingApi";
import { getStatusConfig } from "@/lib/statusConfig";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.orderId ? decodeURIComponent(params.orderId) : "";

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  // 1. Initial Load of Order & Attached Shipment
  const loadOrder = useCallback(async (isRefresh = false) => {
    if (!orderId) return;

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const data = await getOrder(orderId);
      setOrder(data);

      const awb = data.waybill || data.shipping?.waybill || data.shipmentDetails?.awbNumber;

      // If AWB exists, also fetch latest live tracking
      if (awb) {
        try {
          const trackRes = await getTracking(awb, { refresh: isRefresh });
          if (trackRes) {
            setOrder((prev) => ({
              ...prev,
              liveTracking: trackRes,
              internalStatus: trackRes.internalStatus || prev.internalStatus,
              shipping: {
                ...prev.shipping,
                status: trackRes.carrierStatus || prev.shipping?.status,
                statusDetails: trackRes.statusDetails,
                currentLocation: trackRes.currentLocation,
                expectedDeliveryDate: trackRes.expectedDeliveryDate,
              },
            }));
          }
        } catch (tErr) {
          console.warn("Live tracking update failed, using order state:", tErr.message);
        }
      }

      setLastSyncedAt(new Date());
    } catch (err) {
      console.error("Failed to load order:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Could not retrieve order details. Please check your connection."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const handleDownloadInvoice = async () => {
    try {
      setDownloadingInvoice(true);
      await downloadInvoicePdf(orderId);
    } catch (err) {
      console.error("Invoice download error:", err);
      alert("Unable to download invoice PDF at this moment. Please try again.");
    } finally {
      setDownloadingInvoice(false);
    }
  };

  // Resolve metadata
  const waybill =
    order?.liveTracking?.waybill ||
    order?.waybill ||
    order?.shipping?.waybill ||
    order?.shipmentDetails?.awbNumber ||
    "";

  const effectiveStatus =
    order?.liveTracking?.internalStatus ||
    order?.internalStatus ||
    order?.shipmentDetails?.internalStatus ||
    order?.shipping?.status ||
    order?.status ||
    "ORDER_CREATED";

  const statusConfig = getStatusConfig(effectiveStatus);

  const carrierStatus =
    order?.liveTracking?.carrierStatus ||
    order?.shipping?.status ||
    order?.shipmentDetails?.carrierStatus ||
    "";

  const currentLocation =
    order?.liveTracking?.currentLocation ||
    order?.shipmentDetails?.currentLocation ||
    order?.shipping?.currentLocation ||
    "";

  const expectedDelivery =
    order?.liveTracking?.expectedDeliveryDate ||
    order?.shipmentDetails?.expectedDeliveryDate ||
    order?.shipping?.expectedDeliveryDate ||
    null;

  const scans = order?.liveTracking?.scans || [];
  const trackingEvents = order?.shipmentDetails?.trackingEvents || [];

  const customerName = order?.customer?.name || order?.name || "Customer";
  const customerPhone = order?.customer?.phone || order?.phone || "-";
  const customerAddress = order?.customer?.address || order?.address || "-";
  const customerPincode = order?.customer?.pincode || order?.pincode || "";

  const paymentStatus = order?.paymentStatus || (order?.paymentMethod === "online" ? "Paid" : "Pending");
  const paymentMethod = order?.paymentMethod ? order.paymentMethod.toUpperCase() : "COD";

  const orderTotal = Number(order?.total || 0);

  return (
    <>
      <Navbar />

      <section className="relative pt-32 pb-14 bg-[#203515] overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Link
                href="/orders"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white mb-3 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Order History
              </Link>
              <h1 className="font-[family-name:var(--font-playfair)] text-white text-3xl sm:text-4xl font-bold tracking-tight">
                Order Details
              </h1>
              <p className="text-white/60 text-xs sm:text-sm mt-1 font-mono">
                #{orderId}
              </p>
            </div>

            {/* Top action toolbar */}
            <div className="flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto mt-1 sm:mt-0">
              <button
                onClick={() => loadOrder(true)}
                disabled={refreshing}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3.5 py-2.5 rounded-2xl backdrop-blur-sm border border-white/20 transition-all cursor-pointer disabled:opacity-50 min-h-[40px]"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                <span>{refreshing ? "Updating..." : "Refresh Tracking"}</span>
              </button>

              <button
                onClick={() => setInvoiceModalOpen(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#8C6A43] hover:bg-amber-600 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-md transition-all cursor-pointer min-h-[40px]"
              >
                <ReceiptText className="w-3.5 h-3.5" />
                <span>Tax Invoice</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="bg-[#fdfbf7] py-6 sm:py-10 px-3 sm:px-4 min-h-[60vh]">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 border-4 border-[#8C6A43] border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 font-medium text-sm">Loading order details...</p>
            </div>
          ) : error ? (
            <div className="max-w-md mx-auto text-center py-16 bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-6">
              <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-gray-900">Order Not Found</h2>
              <p className="text-gray-500 text-xs mt-1 leading-relaxed">{error}</p>
              <Link
                href="/orders"
                className="mt-6 inline-flex items-center gap-2 bg-[#203515] text-white text-xs font-bold px-6 py-3 rounded-2xl hover:bg-[#2e4c1f] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Orders
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Left 2 Cols: Status Overview & Tracking Timeline */}
              <div className="lg:col-span-2 space-y-5 sm:space-y-6">
                {/* 1. Order Logistics Overview Banner */}
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-gray-100">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Order Date
                      </p>
                      <p className="text-sm font-semibold text-gray-800 mt-1">
                        {formatDisplayDate(order.createdAt || order.date)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Payment Status
                      </p>
                      <p className="mt-1">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            paymentStatus === "Paid"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : paymentStatus === "Failed"
                              ? "bg-rose-50 text-rose-800 border border-rose-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {paymentStatus} ({paymentMethod})
                        </span>
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Courier Partner
                      </p>
                      <p className="text-sm font-bold text-[#203515] mt-1 flex items-center gap-1">
                        <Truck className="w-4 h-4 text-[#8C6A43]" />
                        Delhivery Express
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        AWB Number
                      </p>
                      <p className="text-sm font-mono font-bold text-gray-900 mt-1">
                        {waybill || "Pending Manifest"}
                      </p>
                    </div>
                  </div>

                  {/* Summary Bar */}
                  <div className="pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700">Shipment Status:</span>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold border ${statusConfig.badgeClass}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                    {lastSyncedAt && (
                      <span className="text-gray-400">
                        Last live check: {formatDisplayDateTime(lastSyncedAt)}
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. Professional Tracking Timeline */}
                <TrackingTimeline
                  status={effectiveStatus}
                  carrierStatus={carrierStatus}
                  scans={scans}
                  trackingEvents={trackingEvents}
                  expectedDelivery={expectedDelivery}
                  currentLocation={currentLocation}
                  waybill={waybill}
                  lastUpdated={lastSyncedAt}
                />

                {/* 3. Ordered Products Breakdown */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#8C6A43]" />
                    Ordered Items ({(order.items || []).length})
                  </h3>

                  <div className="divide-y divide-gray-100">
                    {(order.items || []).map((item, idx) => {
                      const productName = item.product?.name || item.name || "Farm Product";
                      const qty = Number(item.count || item.qty || 1);
                      const price = Number(item.price || 0);
                      const variant = item.quantity || item.variant || "Standard";
                      const productObj = item.product || {
                        id: item.productId || idx,
                        name: productName,
                        imageUrl: item.imageUrl || item.product?.imageUrl || "",
                      };

                      return (
                        <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-12 h-12 rounded-2xl bg-amber-50/60 border border-amber-100 flex items-center justify-center shrink-0 overflow-hidden text-[#203515]">
                              <ProductIcon product={productObj} className="w-9 h-9 object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-gray-900 text-sm truncate">{productName}</p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {variant} × {qty}
                              </p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-sm text-[#203515]">
                              ₹{(price * qty).toLocaleString("en-IN")}
                            </p>
                            <p className="text-[11px] text-gray-400">
                              (₹{price.toLocaleString("en-IN")} each)
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Col: Customer Details & Financial Summary */}
              <div className="space-y-6">
                {/* 1. Delivery Details Card */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
                  <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#8C6A43]" />
                    Delivery Address
                  </h3>

                  <div className="text-xs space-y-2 text-gray-600">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Recipient
                      </p>
                      <p className="text-sm font-bold text-gray-900 mt-0.5">{customerName}</p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Contact Phone
                      </p>
                      <p className="text-gray-800 font-semibold mt-0.5">{customerPhone}</p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Shipping Address
                      </p>
                      <p className="text-gray-800 leading-relaxed mt-0.5">{customerAddress}</p>
                      {customerPincode && (
                        <p className="text-gray-500 font-mono mt-0.5">
                          PIN: <strong>{customerPincode}</strong>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Order Summary Card */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
                  <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                    <ReceiptText className="w-4 h-4 text-[#8C6A43]" />
                    Payment Summary
                  </h3>

                  <div className="space-y-2.5 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Items Subtotal:</span>
                      <span className="font-mono text-gray-900 font-semibold">
                        ₹{orderTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping Fee:</span>
                      <span className="text-emerald-700 font-semibold">FREE (Farm Standard)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (Included):</span>
                      <span className="text-gray-500">5% Food Standard</span>
                    </div>
                    <div className="border-t border-gray-100 pt-3 flex justify-between font-black text-base text-[#203515]">
                      <span>Total Amount:</span>
                      <span>₹{orderTotal.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <div className="pt-2 space-y-2">
                    <button
                      onClick={() => setInvoiceModalOpen(true)}
                      className="w-full inline-flex items-center justify-center gap-2 bg-amber-50/70 hover:bg-amber-100/70 text-[#8C6A43] border border-amber-200/80 font-bold text-xs py-2.5 px-4 rounded-2xl transition-all cursor-pointer"
                    >
                      <ReceiptText className="w-4 h-4" />
                      <span>View Tax Invoice</span>
                    </button>

                    <button
                      onClick={handleDownloadInvoice}
                      disabled={downloadingInvoice}
                      className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-bold text-xs py-2.5 px-4 rounded-2xl transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Download className="w-4 h-4 text-gray-500" />
                      <span>{downloadingInvoice ? "Generating PDF..." : "Download Official PDF"}</span>
                    </button>
                  </div>
                </div>

                {/* 3. Delhivery Assurance Card */}
                <div className="bg-[#203515]/5 border border-[#203515]/15 rounded-3xl p-5 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-[#203515] font-bold">
                    <ShieldCheck className="w-4 h-4 text-[#8C6A43]" />
                    <span>Safe & Insured Delivery</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-[11px]">
                    All parcels dispatched from Dronagiri Farms Orchha are handled via Delhivery Express surface network with temperature and transit monitoring.
                  </p>
                  {waybill && (
                    <a
                      href={`https://www.delhivery.com/track/package/${waybill}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8C6A43] hover:underline pt-1"
                    >
                      <span>Track directly on Delhivery</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Invoice Preview Modal */}
      <InvoiceModal
        orderId={orderId}
        open={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
      />

      <Footer />
    </>
  );
}
