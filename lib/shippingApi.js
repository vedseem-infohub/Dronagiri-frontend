import axios from "axios";

/**
 * Resolves the active backend API URL
 */
export function getBackendUrl() {
  if (typeof window !== "undefined") {
    // Check next public env first
    if (process.env.NEXT_PUBLIC_API_BACKEND_URL) {
      return process.env.NEXT_PUBLIC_API_BACKEND_URL.replace(/\/+$/, "");
    }
    // If running in development on localhost
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "http://localhost:8000";
    }
  }
  return (process.env.NEXT_PUBLIC_API_BACKEND_URL || "https://dronagiri-backend-e4ja.onrender.com").replace(/\/+$/, "");
}

/**
 * 1. Fetch Order Details with attached Shipment and Items
 */
export async function getOrder(orderId) {
  if (!orderId) throw new Error("Order ID is required");
  const backendUrl = getBackendUrl();

  try {
    const res = await axios.get(`${backendUrl}/api/orders/${encodeURIComponent(orderId)}`, {
      withCredentials: true,
      timeout: 10000,
    });
    return res.data;
  } catch (backendErr) {
    // If user is guest/offline, check local storage
    if (typeof window !== "undefined") {
      try {
        const local = JSON.parse(localStorage.getItem("dronagiri_orders") || "[]");
        const match = local.find((o) => o.orderId === orderId || o.id === orderId);
        if (match) return match;
      } catch (localErr) {
        // ignore
      }
    }
    throw backendErr;
  }
}

/**
 * 2. Fetch or Sync Live Delhivery Tracking
 * @param {string} waybill - Delhivery AWB number
 * @param {object} [options] - { refresh: boolean }
 */
export async function getTracking(waybill, options = {}) {
  const cleanWaybill = String(waybill || "").trim();
  if (!cleanWaybill) throw new Error("AWB waybill number is required");

  const backendUrl = getBackendUrl();
  const query = options.refresh ? "?refresh=true" : "";

  // Attempt backend tracking endpoint
  try {
    const res = await axios.get(`${backendUrl}/api/shipping/track/${encodeURIComponent(cleanWaybill)}${query}`, {
      withCredentials: true,
      timeout: 12000,
    });
    if (res.data?.success && res.data?.data) {
      return res.data.data;
    }
    return res.data;
  } catch (err) {
    // Fallback to local Next.js proxy route
    try {
      const proxyRes = await axios.get(`/api/shipping/track/${encodeURIComponent(cleanWaybill)}`);
      if (proxyRes.data?.success && proxyRes.data?.data) {
        return proxyRes.data.data;
      }
    } catch (proxyErr) {
      // ignore
    }
    throw err;
  }
}

/**
 * 3. Fetch Structured JSON Invoice Data for Preview
 */
export async function getInvoiceData(orderId) {
  if (!orderId) throw new Error("Order ID is required");
  const backendUrl = getBackendUrl();

  const res = await axios.get(`${backendUrl}/api/orders/${encodeURIComponent(orderId)}/invoice?format=json`, {
    withCredentials: true,
    timeout: 10000,
  });

  return res.data?.data || res.data;
}

/**
 * 4. Download Official Backend-Generated Tax Invoice (PDF)
 */
export async function downloadInvoicePdf(orderId, filename) {
  if (!orderId) throw new Error("Order ID is required");
  const backendUrl = getBackendUrl();

  const res = await axios.get(`${backendUrl}/api/orders/${encodeURIComponent(orderId)}/invoice`, {
    responseType: "blob",
    withCredentials: true,
    timeout: 15000,
  });

  const blobUrl = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename || `Invoice-${orderId}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(blobUrl);
  return true;
}

/**
 * 5. Download Shipping Label PDF (Admin / Store)
 */
export async function downloadShippingLabel(waybill) {
  const cleanWaybill = String(waybill || "").trim();
  if (!cleanWaybill) throw new Error("AWB waybill is required");
  const backendUrl = getBackendUrl();

  const res = await axios.get(`${backendUrl}/api/shipping/label/${encodeURIComponent(cleanWaybill)}`, {
    responseType: "blob",
    withCredentials: true,
    timeout: 15000,
  });

  const blobUrl = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = `delhivery-label-${cleanWaybill}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(blobUrl);
  return true;
}

/**
 * Date Formatting Helpers
 */
export function formatDisplayDate(val, fallback = "-") {
  if (!val) return fallback;
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return fallback;
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return fallback;
  }
}

export function formatDisplayDateTime(val, fallback = "-") {
  if (!val) return fallback;
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return fallback;
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return fallback;
  }
}
