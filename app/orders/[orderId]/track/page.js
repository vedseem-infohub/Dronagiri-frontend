"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Truck,
  Package,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Calendar,
  MapPin,
  AlertCircle,
} from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import TrackingTimeline from "@/app/components/TrackingTimeline";
import { getOrder, getTracking, formatDisplayDateTime } from "@/lib/shippingApi";
import { getStatusConfig } from "@/lib/statusConfig";

function OrderTrackContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  const orderId = params?.orderId ? decodeURIComponent(params.orderId) : "";
  const queryWaybill = searchParams?.get("waybill") || "";

  const [order, setOrder] = useState(null);
  const [waybill, setWaybill] = useState(queryWaybill);
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      let foundWaybill = queryWaybill;

      // 1. Fetch order if orderId is available
      if (orderId) {
        try {
          const ord = await getOrder(orderId);
          setOrder(ord);
          if (ord.waybill || ord.shipping?.waybill || ord.shipmentDetails?.awbNumber) {
            foundWaybill = ord.waybill || ord.shipping?.waybill || ord.shipmentDetails?.awbNumber;
            setWaybill(foundWaybill);
          }
        } catch (ordErr) {
          console.warn("Could not load order:", ordErr.message);
        }
      }

      // 2. Fetch live tracking if waybill is known
      if (foundWaybill) {
        try {
          const track = await getTracking(foundWaybill, { refresh: isRefresh });
          if (track) {
            setTrackingData(track);
          }
        } catch (trackErr) {
          console.warn("Could not fetch tracking:", trackErr.message);
          setError("Tracking information is temporarily unavailable. Please try again shortly.");
        }
      } else {
        setError("No Delhivery tracking number (AWB) has been assigned to this order yet.");
      }

      setLastRefreshed(new Date());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [orderId, queryWaybill]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const effectiveStatus =
    trackingData?.internalStatus ||
    order?.internalStatus ||
    order?.shipping?.status ||
    order?.status ||
    "ORDER_CREATED";

  const carrierStatus = trackingData?.carrierStatus || order?.shipping?.status || "";
  const currentLocation = trackingData?.currentLocation || order?.shipping?.currentLocation || "";
  const expectedDelivery = trackingData?.expectedDeliveryDate || order?.shipping?.expectedDeliveryDate || null;
  const scans = trackingData?.scans || [];
  const trackingEvents = order?.shipmentDetails?.trackingEvents || [];

  return (
    <>
      <Navbar />

      <section className="relative pt-32 pb-14 bg-[#203515] overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link
                  href={orderId ? `/orders/${encodeURIComponent(orderId)}` : "/orders"}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {orderId ? "Back to Order Details" : "Back to Orders"}
                </Link>
              </div>
              <h1 className="font-[family-name:var(--font-playfair)] text-white text-3xl sm:text-4xl font-bold">
                Live Shipment Tracking
              </h1>
              {waybill && (
                <p className="text-white/70 text-xs font-mono mt-1">
                  Delhivery AWB: <strong className="text-white">{waybill}</strong>
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => loadData(true)}
                disabled={refreshing || !waybill}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-2xl border border-white/20 backdrop-blur-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                <span>{refreshing ? "Updating..." : "Refresh Tracking"}</span>
              </button>

              {orderId && (
                <Link
                  href={`/orders/${encodeURIComponent(orderId)}`}
                  className="inline-flex items-center gap-1.5 bg-[#8C6A43] hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-2xl shadow-sm transition-all"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>View Order</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="bg-[#fdfbf7] py-10 px-4 min-h-[60vh]">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 border-4 border-[#8C6A43] border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 font-medium text-sm">Connecting to Delhivery tracking network...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {error && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 text-amber-900 text-xs">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Dynamic Tracking Timeline */}
              <TrackingTimeline
                status={effectiveStatus}
                carrierStatus={carrierStatus}
                scans={scans}
                trackingEvents={trackingEvents}
                expectedDelivery={expectedDelivery}
                currentLocation={currentLocation}
                waybill={waybill}
                lastUpdated={lastRefreshed}
              />

              {/* Carrier Direct Link */}
              {waybill && (
                <div className="text-center pt-2">
                  <a
                    href={`https://www.delhivery.com/track/package/${waybill}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C6A43] hover:underline"
                  >
                    <span>View official Delhivery tracking portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function OrderTrackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
          <div className="w-12 h-12 border-4 border-[#8C6A43] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <OrderTrackContent />
    </Suspense>
  );
}
