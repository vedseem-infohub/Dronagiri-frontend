"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Printer,
  Download,
  ReceiptText,
  Building2,
  MapPin,
  FileCheck,
  Loader2,
  AlertCircle,
  Package,
} from "lucide-react";
import { getInvoiceData, downloadInvoicePdf, formatDisplayDate } from "@/lib/shippingApi";

export default function InvoiceModal({ orderId, open, onClose }) {
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || !orderId) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    async function loadData() {
      try {
        const data = await getInvoiceData(orderId);
        if (isMounted) setInvoice(data);
      } catch (err) {
        console.error("Failed to load invoice preview:", err);
        if (isMounted) {
          setError(
            err.response?.data?.message ||
            err.message ||
            "Invoice is not available yet. Please try again shortly."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [open, orderId]);

  if (!open) return null;

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const filename = invoice?.invoiceNumber
        ? `Invoice-${invoice.invoiceNumber.replace(/[\/\\]/g, "-")}.pdf`
        : `Invoice-${orderId}.pdf`;
      await downloadInvoicePdf(orderId, filename);
    } catch (err) {
      console.error("PDF download error:", err);
      alert("Unable to download invoice PDF at this moment. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const seller = invoice?.seller || {
    companyName: "Dronagiri Farms Private Limited",
    address: "Village Orchha, Dist. Niwari, MP 472246",
    gstin: "23AABCD1234F1Z5",
    state: "Madhya Pradesh",
    pan: "AABCD1234F",
  };

  const customer = invoice?.customer || {};
  const items = invoice?.items || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full max-h-[94vh] sm:max-h-[92vh] overflow-hidden shadow-2xl border border-gray-100 flex flex-col print:shadow-none print:border-none print:max-h-full print:w-full">
        {/* Modal Toolbar (hidden in print) */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-gradient-to-r from-[#203515] to-[#2e4c1f] text-white flex items-center justify-between gap-2 print:hidden">
          <div className="flex items-center gap-2 min-w-0">
            <ReceiptText className="w-5 h-5 text-green-400 shrink-0" />
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base leading-tight truncate">
                Tax Invoice Preview
              </h3>
              <p className="text-[11px] text-white/70 truncate">
                Order: <span className="font-mono text-white">#{orderId}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handlePrint}
              disabled={loading || !invoice}
              className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              title="Print Invoice"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={loading || downloading || !invoice}
              className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-400 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {downloading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>PDF</span>
            </button>

            <button
              onClick={onClose}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer ml-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body / Invoice Sheet */}
        <div className="p-4 sm:p-7 overflow-y-auto flex-1 space-y-5 sm:space-y-6 text-gray-800 bg-white print:p-0">
          {loading ? (
            <div className="min-h-[250px] flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-[#8C6A43] animate-spin" />
              <p className="text-gray-500 text-xs sm:text-sm">Preparing official tax invoice...</p>
            </div>
          ) : error ? (
            <div className="min-h-[220px] flex flex-col items-center justify-center text-center p-5 bg-rose-50/50 rounded-2xl border border-rose-100">
              <AlertCircle className="w-9 h-9 text-rose-500 mb-2" />
              <h4 className="font-bold text-gray-900 text-sm sm:text-base">Invoice Unavailable</h4>
              <p className="text-gray-500 text-xs mt-1 max-w-sm">{error}</p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          ) : invoice ? (
            <div id="invoice-sheet" className="space-y-5 sm:space-y-6">
              {/* Header: Company Details & Invoice Metadata */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-gray-200 pb-4 sm:pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl font-black tracking-tight text-[#203515]">
                      DRONAGIRI FARMS
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{seller.companyName}</p>
                  <p className="text-xs text-gray-500">{seller.address}</p>
                  <p className="text-xs text-gray-500">
                    State: <strong className="text-gray-700">{seller.state}</strong> | PAN: <strong className="text-gray-700">{seller.pan}</strong>
                  </p>
                  <p className="text-xs font-semibold text-[#8C6A43] mt-0.5">
                    GSTIN: <strong className="font-mono">{seller.gstin}</strong>
                  </p>
                </div>

                <div className="sm:text-right bg-amber-50/60 border border-amber-200/80 rounded-2xl p-3.5 sm:p-4 sm:min-w-[220px]">
                  <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-900">
                    TAX INVOICE
                  </p>
                  <p className="font-mono text-sm sm:text-base font-black text-gray-900 mt-0.5 break-all">
                    {invoice.invoiceNumber}
                  </p>
                  <div className="text-[11px] sm:text-xs text-gray-600 mt-2 space-y-0.5">
                    <p>
                      Invoice Date:{" "}
                      <strong className="text-gray-800 font-semibold">
                        {formatDisplayDate(invoice.invoiceDate)}
                      </strong>
                    </p>
                    <p>
                      Order Number:{" "}
                      <strong className="text-gray-800 font-mono">
                        {invoice.orderId}
                      </strong>
                    </p>
                    {invoice.orderDate && (
                      <p>
                        Order Date:{" "}
                        <strong className="text-gray-800 font-semibold">
                          {formatDisplayDate(invoice.orderDate)}
                        </strong>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Billing & Shipping Addresses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
                <div className="bg-gray-50/70 rounded-2xl p-3.5 sm:p-4 border border-gray-100">
                  <p className="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-1">
                    Billed To
                  </p>
                  <p className="font-bold text-gray-900 text-sm">{customer.name || "Valued Customer"}</p>
                  <p className="text-gray-600 mt-1 leading-relaxed">{customer.address || "Address not provided"}</p>
                  {customer.pincode && <p className="text-gray-600">Pincode: {customer.pincode}</p>}
                  {customer.phone && <p className="text-gray-600">Phone: {customer.phone}</p>}
                  {customer.email && <p className="text-gray-600 truncate">Email: {customer.email}</p>}
                </div>

                <div className="bg-gray-50/70 rounded-2xl p-3.5 sm:p-4 border border-gray-100">
                  <p className="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-1">
                    Shipped To
                  </p>
                  <p className="font-bold text-gray-900 text-sm">{customer.name || "Valued Customer"}</p>
                  <p className="text-gray-600 mt-1 leading-relaxed">{customer.address || "Same as billing address"}</p>
                  {customer.pincode && <p className="text-gray-600">Pincode: {customer.pincode}</p>}
                  <p className="text-gray-500 mt-1">
                    Place of Supply:{" "}
                    <strong className="text-gray-700">
                      {customer.state || (invoice.isInterstate ? "Interstate" : "Madhya Pradesh")}
                    </strong>
                  </p>
                </div>
              </div>

              {/* Product Items: Mobile Cards (<sm) */}
              <div className="sm:hidden space-y-2.5">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Items ({items.length})
                </p>
                <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl p-3 bg-gray-50/40">
                  {items.map((item, idx) => {
                    const taxTotal = (Number(item.cgstAmount || 0) + Number(item.sgstAmount || 0) + Number(item.igstAmount || 0));
                    return (
                      <div key={idx} className="py-2.5 first:pt-0 last:pb-0 text-xs">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <p className="font-bold text-gray-900">{item.name}</p>
                            {item.variant && <p className="text-[11px] text-gray-400">{item.variant}</p>}
                          </div>
                          <p className="font-bold text-[#203515]">₹{Number(item.total || 0).toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                          <span>Qty: <strong className="text-gray-800">{item.quantity}</strong> × ₹{Number(item.unitPrice || 0).toFixed(2)}</span>
                          <span>Tax (5%): ₹{taxTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Product Items: Table (>=sm) */}
              <div className="hidden sm:block border border-gray-200 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-100/80 text-gray-700 font-bold border-b border-gray-200">
                        <th className="p-2.5 sm:p-3">#</th>
                        <th className="p-2.5 sm:p-3">Item Description</th>
                        <th className="p-2.5 sm:p-3 text-center">Qty</th>
                        <th className="p-2.5 sm:p-3 text-right">Unit Price</th>
                        <th className="p-2.5 sm:p-3 text-right">Taxable</th>
                        <th className="p-2.5 sm:p-3 text-right">
                          {invoice.isInterstate ? "IGST (5%)" : "GST (2.5%+2.5%)"}
                        </th>
                        <th className="p-2.5 sm:p-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {items.map((item, idx) => {
                        const taxTotal = (Number(item.cgstAmount || 0) + Number(item.sgstAmount || 0) + Number(item.igstAmount || 0));
                        return (
                          <tr key={idx} className="hover:bg-gray-50/50">
                            <td className="p-2.5 sm:p-3 text-gray-400">{idx + 1}</td>
                            <td className="p-2.5 sm:p-3">
                              <p className="font-semibold text-gray-900">{item.name}</p>
                              {item.variant && (
                                <p className="text-[10px] text-gray-400 font-medium">{item.variant}</p>
                              )}
                            </td>
                            <td className="p-2.5 sm:p-3 text-center font-bold text-gray-800">
                              {item.quantity}
                            </td>
                            <td className="p-2.5 sm:p-3 text-right text-gray-700">
                              ₹{Number(item.unitPrice || 0).toFixed(2)}
                            </td>
                            <td className="p-2.5 sm:p-3 text-right text-gray-700">
                              ₹{Number(item.taxableAmount || 0).toFixed(2)}
                            </td>
                            <td className="p-2.5 sm:p-3 text-right text-gray-600">
                              ₹{taxTotal.toFixed(2)}
                            </td>
                            <td className="p-2.5 sm:p-3 text-right font-bold text-[#203515]">
                              ₹{Number(item.total || 0).toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary Breakdown */}
              <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-4 pt-2">
                <div className="text-xs text-gray-500 max-w-sm space-y-1">
                  <p className="font-semibold text-gray-700">Terms & Conditions:</p>
                  <p className="text-[11px] leading-relaxed">
                    1. Goods once sold are backed by Dronagiri Farms 100% freshness guarantee.
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    2. This is a computer-generated tax invoice verified under the Indian GST regime.
                  </p>
                </div>

                <div className="w-full sm:w-72 bg-gray-50/80 rounded-2xl p-3.5 sm:p-4 border border-gray-100 text-xs space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Taxable Subtotal:</span>
                    <span className="font-mono">₹{Number(invoice.subtotal || 0).toFixed(2)}</span>
                  </div>
                  {Number(invoice.discountTotal || 0) > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount:</span>
                      <span className="font-mono">-₹{Number(invoice.discountTotal).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping & Handling:</span>
                    <span className="font-mono">
                      {Number(invoice.shippingFee || 0) === 0 ? "FREE" : `₹${Number(invoice.shippingFee).toFixed(2)}`}
                    </span>
                  </div>
                  {invoice.isInterstate ? (
                    <div className="flex justify-between text-gray-600">
                      <span>IGST (5%):</span>
                      <span className="font-mono">₹{Number(invoice.igstTotal || 0).toFixed(2)}</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between text-gray-600">
                        <span>CGST (2.5%):</span>
                        <span className="font-mono">₹{Number(invoice.cgstTotal || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>SGST (2.5%):</span>
                        <span className="font-mono">₹{Number(invoice.sgstTotal || 0).toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-black text-sm text-[#203515]">
                    <span>Grand Total:</span>
                    <span className="font-mono">₹{Number(invoice.grandTotal || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
