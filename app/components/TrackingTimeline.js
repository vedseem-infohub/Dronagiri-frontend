"use client";

import React, { useMemo } from "react";
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  MapPin,
  AlertTriangle,
  RotateCcw,
  XCircle,
  ShieldCheck,
  Calendar,
  Sparkles,
} from "lucide-react";
import {
  getStatusConfig,
  STANDARD_MILESTONES,
  isMilestoneCompleted,
  isCurrentMilestone,
} from "@/lib/statusConfig";
import { formatDisplayDateTime } from "@/lib/shippingApi";

/**
 * Deduplicates and sorts carrier scan events chronologically (newest first for activity feed)
 */
function processScanEvents(scans = [], trackingEvents = []) {
  const combined = [...scans];

  if (Array.isArray(trackingEvents)) {
    for (const te of trackingEvents) {
      combined.push({
        status: te.status || te.internalStatus,
        instructions: te.description || te.instructions,
        location: te.location,
        statusDateTime: te.eventTime || te.statusDateTime,
      });
    }
  }

  const seen = new Set();
  const valid = [];

  for (const item of combined) {
    if (!item) continue;
    const timeStr = item.statusDateTime || item.eventTime || "";
    const timeKey = timeStr ? new Date(timeStr).toISOString().substring(0, 16) : "";
    const dedupeKey = `${String(item.status || "").toLowerCase()}_${timeKey}_${String(item.location || "").toLowerCase()}`;

    if (!seen.has(dedupeKey)) {
      seen.add(dedupeKey);
      valid.push({
        status: item.status || "Logistics Update",
        instructions: item.instructions || item.description || "",
        location: item.location || "",
        date: item.statusDateTime || item.eventTime || null,
      });
    }
  }

  valid.sort((a, b) => {
    const timeA = a.date ? new Date(a.date).getTime() : 0;
    const timeB = b.date ? new Date(b.date).getTime() : 0;
    return timeB - timeA;
  });

  return valid;
}

export default function TrackingTimeline({
  status = "ORDER_CREATED",
  carrierStatus = "",
  scans = [],
  trackingEvents = [],
  expectedDelivery = null,
  currentLocation = "",
  waybill = "",
  lastUpdated = null,
}) {
  const currentConfig = useMemo(() => {
    return getStatusConfig(status || carrierStatus);
  }, [status, carrierStatus]);

  const cleanScans = useMemo(() => {
    return processScanEvents(scans, trackingEvents);
  }, [scans, trackingEvents]);

  const isException = currentConfig.isException;
  const isCancelled = currentConfig.code === "CANCELLED";

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-7 space-y-6 sm:space-y-8 overflow-hidden">
      {/* 1. Header with Current Status Badge & Estimated Delivery */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 border-b border-gray-100 pb-4 sm:pb-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${currentConfig.badgeClass}`}
            >
              <span className={`w-2 h-2 rounded-full ${currentConfig.bgClass} animate-pulse`} />
              {currentConfig.label}
            </span>
            {waybill && (
              <span className="text-xs text-gray-400 font-mono break-all">
                AWB: <strong className="text-gray-700">{waybill}</strong>
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-xl leading-relaxed">
            {currentConfig.description}
          </p>
        </div>

        {/* Delivery / Location Meta */}
        <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2 sm:gap-1 text-xs shrink-0">
          {expectedDelivery && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-2.5 py-1 text-emerald-900 font-semibold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                Est. Delivery:{" "}
                <strong>
                  {new Date(expectedDelivery).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </strong>
              </span>
            </div>
          )}
          {currentLocation && (
            <div className="text-gray-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#8C6A43] shrink-0" />
              <span>Current Hub: <strong className="text-gray-800">{currentLocation}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Exception Alert (NDR / RTO / Cancelled) */}
      {isException && (
        <div
          className={`rounded-2xl p-3.5 sm:p-4 flex items-start gap-3 text-xs sm:text-sm border ${
            isCancelled
              ? "bg-rose-50 border-rose-200 text-rose-900"
              : currentConfig.code === "NDR"
              ? "bg-amber-50 border-amber-200 text-amber-900"
              : "bg-purple-50 border-purple-200 text-purple-900"
          }`}
        >
          {isCancelled ? (
            <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          ) : currentConfig.code === "NDR" ? (
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <RotateCcw className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-bold">{currentConfig.label}</p>
            <p className="text-xs mt-0.5 opacity-90 leading-relaxed">
              {currentConfig.description}
            </p>
          </div>
        </div>
      )}

      {/* 3. Progressive Visual Milestone Bar */}
      {!isCancelled && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Fulfillment Progress
          </h4>

          {/* Desktop & Tablet Horizontal Milestone Stepper */}
          <div className="hidden md:flex items-center justify-between relative py-2">
            <div className="absolute top-1/2 left-4 right-4 h-1 -translate-y-1/2 bg-gray-100 z-0 rounded-full" />
            <div
              className="absolute top-1/2 left-4 h-1 -translate-y-1/2 bg-emerald-500 z-0 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(
                  Math.max((currentConfig.timelineStage / (STANDARD_MILESTONES.length - 1)) * 100, 0),
                  100
                )}%`,
              }}
            />

            {STANDARD_MILESTONES.map((m) => {
              const completed = isMilestoneCompleted(currentConfig, m.stage);
              const current = isCurrentMilestone(currentConfig, m.stage);

              return (
                <div key={m.stage} className="relative z-10 flex flex-col items-center text-center group">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                      completed
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/20"
                        : current
                        ? "bg-sky-500 text-white ring-4 ring-sky-100 shadow-md animate-pulse"
                        : "bg-white border-2 border-gray-200 text-gray-400"
                    }`}
                  >
                    {completed ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span>{m.stage + 1}</span>
                    )}
                  </div>
                  <p
                    className={`text-xs mt-2 font-semibold transition-colors ${
                      completed || current ? "text-gray-900 font-bold" : "text-gray-400"
                    }`}
                  >
                    {m.label}
                  </p>
                  <p className="text-[10px] text-gray-400 max-w-[85px] truncate">
                    {m.shortDesc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Mobile Native Vertical Stepper with Continuous Connecting Line */}
          <div className="md:hidden relative pl-6 space-y-4 pt-1 before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
            {STANDARD_MILESTONES.map((m) => {
              const completed = isMilestoneCompleted(currentConfig, m.stage);
              const current = isCurrentMilestone(currentConfig, m.stage);

              return (
                <div key={m.stage} className="relative flex items-center justify-between gap-3">
                  <div
                    className={`absolute -left-6 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                      completed
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : current
                        ? "bg-sky-500 text-white border-sky-500 ring-4 ring-sky-100 animate-pulse"
                        : "bg-white text-gray-400 border-gray-300"
                    }`}
                  >
                    {completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : m.stage + 1}
                  </div>
                  <div className="pl-2 flex-1 flex items-baseline justify-between min-w-0">
                    <p
                      className={`text-xs truncate ${
                        completed
                          ? "text-emerald-900 font-semibold"
                          : current
                          ? "text-sky-900 font-bold"
                          : "text-gray-400"
                      }`}
                    >
                      {m.label}
                    </p>
                    <span className="text-[10px] text-gray-400 shrink-0 ml-2">
                      {m.shortDesc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Detailed Chronological Scan Event Activity Feed */}
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-[#8C6A43]" />
            Tracking Activity Feed
          </h4>
          {lastUpdated && (
            <span className="text-[11px] text-gray-400">
              Synced: {formatDisplayDateTime(lastUpdated)}
            </span>
          )}
        </div>

        {cleanScans.length === 0 ? (
          <div className="bg-amber-50/60 border border-amber-200/70 rounded-2xl p-4 text-center">
            <p className="text-xs font-bold text-amber-900">
              Courier Dispatch Manifest Created
            </p>
            <p className="text-xs text-amber-700/80 mt-1 max-w-md mx-auto">
              Package is being prepared for carrier handover at Dronagiri Farms. Live transit scans will appear here as soon as Delhivery scans the barcode at the pickup terminal.
            </p>
          </div>
        ) : (
          <div className="relative pl-6 space-y-5 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
            {cleanScans.map((event, idx) => {
              const isLatest = idx === 0;

              return (
                <div key={idx} className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 group">
                  {/* Dot */}
                  <span
                    className={`absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white transition-all ${
                      isLatest
                        ? "bg-emerald-600 ring-4 ring-emerald-100 scale-110"
                        : "bg-gray-300"
                    }`}
                  />

                  {/* Event Details */}
                  <div className="pr-2 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p
                        className={`text-xs sm:text-sm font-bold ${
                          isLatest ? "text-gray-900" : "text-gray-700"
                        }`}
                      >
                        {event.status}
                      </p>
                      {isLatest && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Latest
                        </span>
                      )}
                    </div>

                    {event.instructions && (
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed break-words">
                        {event.instructions}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                      {event.location && (
                        <p className="text-[11px] text-gray-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#8C6A43] shrink-0" />
                          <span>{event.location}</span>
                        </p>
                      )}
                      {event.date && (
                        <span className="text-[11px] text-gray-400 sm:hidden font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-400 shrink-0" />
                          {formatDisplayDateTime(event.date)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Desktop Timestamp */}
                  {event.date && (
                    <span className="hidden sm:inline-block text-xs text-gray-400 whitespace-nowrap self-start mt-0.5 font-mono">
                      {formatDisplayDateTime(event.date)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
