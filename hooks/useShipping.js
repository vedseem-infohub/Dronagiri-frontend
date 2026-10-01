"use client";

import { useState, useCallback, useRef } from "react";
import axios from "axios";

/**
 * Custom React Hook: useShipping
 * Provides unified access to Delhivery shipping API operations:
 * - Pincode serviceability check
 * - Shipping cost calculation based on weight & destination
 * - Live shipment tracking with normalized timeline stages
 * - Shipping label PDF download
 */
export function useShipping(options = {}) {
  const serverUrl = options.serverUrl || process.env.NEXT_PUBLIC_API_BACKEND_URL || "";

  // Loading States
  const [loading, setLoading] = useState(false);
  const [costLoading, setCostLoading] = useState(false);
  const [trackLoading, setTrackLoading] = useState(false);
  const [labelLoading, setLabelLoading] = useState(false);

  // Errors
  const [error, setError] = useState(null);
  const [costError, setCostError] = useState(null);
  const [trackError, setTrackError] = useState(null);

  // Serviceability Data
  const [serviceability, setServiceability] = useState({
    checked: false,
    serviceable: null,
    codAvailable: null,
    prepaidAvailable: null,
    city: "",
    state: "",
    message: "",
  });

  // Shipping Cost Data
  const [shippingRate, setShippingRate] = useState(null);

  // Tracking Data
  const [trackingData, setTrackingData] = useState(null);

  const abortControllerRef = useRef(null);

  /**
   * 1. Check Pincode Serviceability
   * Calls /api/shipping/check-pincode (falls back to backend URL or GET route)
   */
  const checkPincode = useCallback(
    async (rawPincode) => {
      const pincode = String(rawPincode || "").trim().replace(/\D/g, "");
      if (!pincode || pincode.length !== 6) {
        setServiceability({
          checked: false,
          serviceable: null,
          codAvailable: null,
          prepaidAvailable: null,
          city: "",
          state: "",
          message: "Please enter a valid 6-digit pincode",
        });
        return { success: false, error: "Invalid 6-digit pincode" };
      }

      setLoading(true);
      setError(null);

      try {
        let res;
        // 1. Try local Next.js POST /api/shipping/check-pincode
        try {
          res = await axios.post("/api/shipping/check-pincode", { pincode }, { timeout: 8000 });
        } catch (e1) {
          // 2. Try backend POST if configured
          if (serverUrl) {
            try {
              res = await axios.post(`${serverUrl}/api/shipping/check-pincode`, { pincode }, { timeout: 8000 });
            } catch (e2) {
              // 3. Fallback to GET route
              res = await axios.get(`/api/shipping/serviceability/${pincode}`, { timeout: 8000 });
            }
          } else {
            res = await axios.get(`/api/shipping/serviceability/${pincode}`, { timeout: 8000 });
          }
        }

        const data = res.data;
        const payload = data.data || data;

        const isServiceable = Boolean(payload.serviceable);
        const codOk = Boolean(payload.codAvailable);
        const prepaidOk = Boolean(payload.prepaidAvailable ?? isServiceable);

        const newServiceability = {
          checked: true,
          pincode,
          serviceable: isServiceable,
          codAvailable: codOk,
          prepaidAvailable: prepaidOk,
          city: payload.city || "",
          state: payload.state || "",
          message: isServiceable
            ? `Delivery available to ${payload.city ? payload.city + (payload.state ? ", " + payload.state : "") : pincode}`
            : (data.message || "This pincode is currently not serviceable by Delhivery"),
        };

        setServiceability(newServiceability);
        return { success: true, data: newServiceability };
      } catch (err) {
        const errorMsg =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Unable to verify pincode at this time. Please try again.";
        setError(errorMsg);

        // Retain fallback grace state to avoid completely blocking users on unexpected network glitches
        const fallbackState = {
          checked: true,
          pincode,
          serviceable: true,
          codAvailable: true,
          prepaidAvailable: true,
          city: "",
          state: "",
          message: "Standard Delivery Available",
          isFallback: true,
        };
        setServiceability(fallbackState);
        return { success: false, error: errorMsg, fallback: fallbackState };
      } finally {
        setLoading(false);
      }
    },
    [serverUrl]
  );

  /**
   * 2. Calculate Shipping Cost
   * Calls /api/shipping/calculate-cost
   */
  const calculateCost = useCallback(
    async ({ destPincode, weight = 500, mode = "Surface", paymentType = "Prepaid", orderAmount = 0 } = {}) => {
      const cleanPin = String(destPincode || "").trim().replace(/\D/g, "");
      if (!cleanPin || cleanPin.length !== 6) {
        return { success: false, error: "Valid destination pincode required for rate calculation" };
      }

      setCostLoading(true);
      setCostError(null);

      const payload = {
        destPincode: cleanPin,
        weight: Number(weight) || 500,
        mode,
        paymentType,
        orderAmount: Number(orderAmount) || 0,
      };

      try {
        let res;
        try {
          res = await axios.post("/api/shipping/calculate-cost", payload, { timeout: 8000 });
        } catch (e1) {
          if (serverUrl) {
            res = await axios.post(`${serverUrl}/api/shipping/calculate-cost`, payload, { timeout: 8000 });
          } else {
            throw e1;
          }
        }

        const data = res.data?.data || res.data;
        const totalAmount = Number(data.totalShippingCost ?? data.totalAmount ?? data.amount ?? 0);
        const baseCharge = Number(data.shippingCharge ?? data.baseCharge ?? totalAmount);
        const codCharges = Number(data.codCharge ?? data.codCharges ?? 0);

        const rateInfo = {
          totalAmount,
          baseCharge,
          codCharges,
          currency: data.currency || "INR",
          estimatedDays: data.estimatedDays || 3,
        };

        setShippingRate(rateInfo);
        return { success: true, data: rateInfo };
      } catch (err) {
        const errorMsg =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Could not compute live shipping cost";
        setCostError(errorMsg);

        // Fallback standard rate
        const fallbackRate = {
          totalAmount: 60,
          baseCharge: 60,
          codCharges: 0,
          currency: "INR",
          estimatedDays: 3,
          isFallback: true,
        };
        setShippingRate(fallbackRate);
        return { success: false, error: errorMsg, fallback: fallbackRate };
      } finally {
        setCostLoading(false);
      }
    },
    [serverUrl]
  );

  /**
   * 3. Track Shipment by Waybill
   * Calls /api/shipping/track/:waybill
   */
  const trackShipment = useCallback(
    async (waybill) => {
      const cleanWaybill = String(waybill || "").trim();
      if (!cleanWaybill) {
        setTrackError("Waybill number is required");
        return { success: false, error: "Waybill number is required" };
      }

      setTrackLoading(true);
      setTrackError(null);

      try {
        let res;
        try {
          res = await axios.get(`/api/shipping/track/${cleanWaybill}`, { timeout: 10000 });
          if (res.data?.success === false && serverUrl) {
            try {
              const serverRes = await axios.get(`${serverUrl}/api/shipping/track/${cleanWaybill}`, { timeout: 10000 });
              if (serverRes.data?.success) {
                res = serverRes;
              }
            } catch (eServer) {}
          }
        } catch (e1) {
          if (serverUrl) {
            res = await axios.get(`${serverUrl}/api/shipping/track/${cleanWaybill}`, { timeout: 10000 });
          } else {
            throw e1;
          }
        }

        if (res.data?.success === false && !res.data?.data) {
          throw new Error(res.data?.error || `No tracking details found for ${cleanWaybill}`);
        }

        const raw = res.data?.data || res.data;
        const status = raw.status || "In Transit";
        const isRto =
          status.toLowerCase().includes("rto") ||
          status.toLowerCase().includes("return") ||
          Boolean(raw.isRto);

        const normalized = {
          waybill: cleanWaybill,
          orderId: raw.orderId || "",
          status: isRto ? "RTO" : status,
          statusDetails: raw.statusDetails || raw.statusMessage || `Shipment is ${status}`,
          statusDateTime: raw.statusDateTime || new Date().toISOString(),
          expectedDeliveryDate: raw.expectedDeliveryDate || null,
          origin: raw.origin || "Dronagiri Farms",
          destination: raw.destination || "Customer Hub",
          isRto,
          scans: Array.isArray(raw.scans) ? raw.scans : [],
          simulated: Boolean(raw.simulated),
        };

        setTrackingData(normalized);
        return { success: true, data: normalized };
      } catch (err) {
        const msg =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Unable to load tracking details at this moment.";
        setTrackError(msg);
        return { success: false, error: msg };
      } finally {
        setTrackLoading(false);
      }
    },
    [serverUrl]
  );

  /**
   * 4. Download Shipping Label (PDF)
   */
  const downloadLabel = useCallback(
    async (waybill) => {
      const cleanWaybill = String(waybill || "").trim();
      if (!cleanWaybill) return;

      setLabelLoading(true);
      try {
        const url = `/api/shipping/label/${cleanWaybill}`;
        const targetUrl = serverUrl ? `${serverUrl}/api/shipping/label/${cleanWaybill}` : url;

        const res = await axios.get(targetUrl, { responseType: "blob" });
        const blobUrl = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = `delhivery-label-${cleanWaybill}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(blobUrl);
        return { success: true };
      } catch (err) {
        const msg = "Failed to download shipping label";
        console.error(msg, err);
        return { success: false, error: msg };
      } finally {
        setLabelLoading(false);
      }
    },
    [serverUrl]
  );

  /**
   * 5. Download Official Tax Invoice (PDF)
   */
  const downloadInvoice = useCallback(
    async (orderId) => {
      const cleanOrderId = String(orderId || "").trim();
      if (!cleanOrderId) return { success: false, error: "Order ID is required" };

      try {
        const url = `/api/orders/${cleanOrderId}/invoice`;
        const targetUrl = serverUrl ? `${serverUrl}/api/orders/${cleanOrderId}/invoice` : url;

        const res = await axios.get(targetUrl, { responseType: "blob", withCredentials: true });
        const blobUrl = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = `Invoice-${cleanOrderId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(blobUrl);
        return { success: true };
      } catch (err) {
        const msg = "Failed to download tax invoice";
        console.error(msg, err);
        return { success: false, error: msg };
      }
    },
    [serverUrl]
  );

  const resetShipping = useCallback(() => {
    setServiceability({
      checked: false,
      serviceable: null,
      codAvailable: null,
      prepaidAvailable: null,
      city: "",
      state: "",
      message: "",
    });
    setShippingRate(null);
    setError(null);
    setCostError(null);
  }, []);

  return {
    loading,
    costLoading,
    trackLoading,
    labelLoading,
    error,
    costError,
    trackError,
    serviceability,
    shippingRate,
    trackingData,
    checkPincode,
    calculateCost,
    trackShipment,
    downloadLabel,
    downloadInvoice,
    resetShipping,
  };
}

export default useShipping;

