/**
 * Normalized Frontend Shipment & Order Status Configuration
 *
 * Maps internal backend logistics statuses to customer-friendly labels,
 * design tokens, icon types, and timeline stage progression.
 */

export const SHIPMENT_STATUSES = {
  ORDER_CREATED: {
    code: "ORDER_CREATED",
    label: "Order Placed",
    description: "Your order has been recorded and is being prepared for fulfillment.",
    tone: "amber",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    bgClass: "bg-amber-500",
    textClass: "text-amber-800",
    timelineStage: 0,
    isTerminal: false,
    isException: false,
  },
  PAYMENT_CONFIRMED: {
    code: "PAYMENT_CONFIRMED",
    label: "Payment Confirmed",
    description: "Payment has been verified. Order sent to dispatch center.",
    tone: "blue",
    badgeClass: "bg-blue-50 text-blue-800 border-blue-200",
    bgClass: "bg-blue-500",
    textClass: "text-blue-800",
    timelineStage: 1,
    isTerminal: false,
    isException: false,
  },
  SHIPMENT_CREATED: {
    code: "SHIPMENT_CREATED",
    label: "Shipment Created",
    description: "Shipment manifest generated. Packaging at Dronagiri Farms Orchha.",
    tone: "purple",
    badgeClass: "bg-purple-50 text-purple-800 border-purple-200",
    bgClass: "bg-purple-500",
    textClass: "text-purple-800",
    timelineStage: 2,
    isTerminal: false,
    isException: false,
  },
  AWB_ASSIGNED: {
    code: "AWB_ASSIGNED",
    label: "Courier Assigned",
    description: "Delhivery tracking number (AWB) assigned. Awaiting carrier pickup.",
    tone: "purple",
    badgeClass: "bg-purple-50 text-purple-800 border-purple-200",
    bgClass: "bg-purple-500",
    textClass: "text-purple-800",
    timelineStage: 2,
    isTerminal: false,
    isException: false,
  },
  PICKUP_REQUESTED: {
    code: "PICKUP_REQUESTED",
    label: "Pickup Requested",
    description: "Courier pickup slot requested at Dronagiri warehouse.",
    tone: "purple",
    badgeClass: "bg-purple-50 text-purple-800 border-purple-200",
    bgClass: "bg-purple-500",
    textClass: "text-purple-800",
    timelineStage: 2,
    isTerminal: false,
    isException: false,
  },
  PICKUP_SCHEDULED: {
    code: "PICKUP_SCHEDULED",
    label: "Pickup Scheduled",
    description: "Delhivery executive scheduled to pick up package.",
    tone: "purple",
    badgeClass: "bg-purple-50 text-purple-800 border-purple-200",
    bgClass: "bg-purple-500",
    textClass: "text-purple-800",
    timelineStage: 2,
    isTerminal: false,
    isException: false,
  },
  PICKED_UP: {
    code: "PICKED_UP",
    label: "Picked Up",
    description: "Package received by Delhivery from Dronagiri Farms.",
    tone: "purple",
    badgeClass: "bg-purple-50 text-purple-800 border-purple-200",
    bgClass: "bg-purple-500",
    textClass: "text-purple-800",
    timelineStage: 3,
    isTerminal: false,
    isException: false,
  },
  IN_TRANSIT: {
    code: "IN_TRANSIT",
    label: "In Transit",
    description: "Package is moving across the Delhivery national delivery network.",
    tone: "purple",
    badgeClass: "bg-purple-50 text-purple-800 border-purple-200",
    bgClass: "bg-purple-500",
    textClass: "text-purple-800",
    timelineStage: 4,
    isTerminal: false,
    isException: false,
  },
  OUT_FOR_DELIVERY: {
    code: "OUT_FOR_DELIVERY",
    label: "Out for Delivery",
    description: "Delhivery courier delivery agent is en route to your doorstep.",
    tone: "sky",
    badgeClass: "bg-sky-50 text-sky-800 border-sky-200",
    bgClass: "bg-sky-500",
    textClass: "text-sky-800",
    timelineStage: 5,
    isTerminal: false,
    isException: false,
  },
  DELIVERED: {
    code: "DELIVERED",
    label: "Delivered",
    description: "Package successfully handed over to recipient.",
    tone: "emerald",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
    bgClass: "bg-emerald-600",
    textClass: "text-emerald-800",
    timelineStage: 6,
    isTerminal: true,
    isException: false,
  },
  NDR: {
    code: "NDR",
    label: "Delivery Rescheduled (NDR)",
    description: "Delivery attempt was unsuccessful (customer unavailable/door closed). Courier will reattempt next business day.",
    tone: "amber",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-300",
    bgClass: "bg-amber-500",
    textClass: "text-amber-800",
    timelineStage: 5,
    isTerminal: false,
    isException: true,
  },
  RTO_INITIATED: {
    code: "RTO_INITIATED",
    label: "Return Initiated (RTO)",
    description: "Delivery could not be completed after attempts; package is being returned to merchant.",
    tone: "rose",
    badgeClass: "bg-rose-50 text-rose-800 border-rose-200",
    bgClass: "bg-rose-500",
    textClass: "text-rose-800",
    timelineStage: 5,
    isTerminal: false,
    isException: true,
  },
  RTO_IN_TRANSIT: {
    code: "RTO_IN_TRANSIT",
    label: "RTO In Transit",
    description: "Return package is in transit back to Dronagiri Farms Orchha.",
    tone: "rose",
    badgeClass: "bg-rose-50 text-rose-800 border-rose-200",
    bgClass: "bg-rose-500",
    textClass: "text-rose-800",
    timelineStage: 5,
    isTerminal: false,
    isException: true,
  },
  RTO_DELIVERED: {
    code: "RTO_DELIVERED",
    label: "Returned to Merchant",
    description: "Package returned safely to origin warehouse.",
    tone: "rose",
    badgeClass: "bg-rose-50 text-rose-800 border-rose-200",
    bgClass: "bg-rose-600",
    textClass: "text-rose-800",
    timelineStage: 6,
    isTerminal: true,
    isException: true,
  },
  CANCELLED: {
    code: "CANCELLED",
    label: "Cancelled",
    description: "This order/shipment has been cancelled.",
    tone: "rose",
    badgeClass: "bg-rose-50 text-rose-800 border-rose-200",
    bgClass: "bg-rose-600",
    textClass: "text-rose-800",
    timelineStage: -1,
    isTerminal: true,
    isException: true,
  },
  SHIPMENT_FAILED: {
    code: "SHIPMENT_FAILED",
    label: "Shipment Processing Error",
    description: "Courier manifest could not be booked. Dispatch team is resolving.",
    tone: "rose",
    badgeClass: "bg-rose-50 text-rose-800 border-rose-200",
    bgClass: "bg-rose-600",
    textClass: "text-rose-800",
    timelineStage: 1,
    isTerminal: false,
    isException: true,
  },
};

/**
 * Standard 7-milestone progressive lifecycle
 */
export const STANDARD_MILESTONES = [
  { stage: 0, key: "ORDER_CREATED", label: "Order Placed", shortDesc: "Order received" },
  { stage: 1, key: "PAYMENT_CONFIRMED", label: "Payment Confirmed", shortDesc: "Payment verified" },
  { stage: 2, key: "SHIPMENT_CREATED", label: "Shipment Created", shortDesc: "Manifested with Delhivery" },
  { stage: 3, key: "PICKED_UP", label: "Picked Up", shortDesc: "Handed over to carrier" },
  { stage: 4, key: "IN_TRANSIT", label: "In Transit", shortDesc: "On the way" },
  { stage: 5, key: "OUT_FOR_DELIVERY", label: "Out for Delivery", shortDesc: "Courier at doorstep" },
  { stage: 6, key: "DELIVERED", label: "Delivered", shortDesc: "Package delivered" },
];

/**
 * Resolves a normalized status configuration safely from any status string
 * @param {string} raw - raw status string from order, shipment, or carrier
 * @returns {object} status config object
 */
export function getStatusConfig(raw = "") {
  if (!raw) return SHIPMENT_STATUSES.ORDER_CREATED;

  const normalizedKey = String(raw).toUpperCase().trim().replace(/[\s-]+/g, "_");

  if (SHIPMENT_STATUSES[normalizedKey]) {
    return SHIPMENT_STATUSES[normalizedKey];
  }

  // Fuzzy matches for legacy / carrier text
  const lower = String(raw).toLowerCase();
  if (lower.includes("rto deliv")) return SHIPMENT_STATUSES.RTO_DELIVERED;
  if (lower.includes("rto in trans") || lower.includes("rto-transit")) return SHIPMENT_STATUSES.RTO_IN_TRANSIT;
  if (lower.includes("rto") || lower.includes("return")) return SHIPMENT_STATUSES.RTO_INITIATED;
  if (lower.includes("deliver") || lower === "dl") return SHIPMENT_STATUSES.DELIVERED;
  if (lower.includes("out for delivery") || lower === "ofd" || lower.includes("dispatched")) {
    return SHIPMENT_STATUSES.OUT_FOR_DELIVERY;
  }
  if (lower.includes("in transit") || lower.includes("transit") || lower.includes("reached") || lower.includes("hub")) {
    return SHIPMENT_STATUSES.IN_TRANSIT;
  }
  if (lower.includes("picked up") || lower.includes("pu") || lower.includes("pickup done")) {
    return SHIPMENT_STATUSES.PICKED_UP;
  }
  if (lower.includes("manifest") || lower.includes("awb") || lower.includes("booked")) {
    return SHIPMENT_STATUSES.AWB_ASSIGNED;
  }
  if (lower.includes("cancel")) return SHIPMENT_STATUSES.CANCELLED;
  if (lower.includes("ndr") || lower.includes("door closed") || lower.includes("customer unavail")) {
    return SHIPMENT_STATUSES.NDR;
  }
  if (lower.includes("confirm") || lower.includes("paid")) return SHIPMENT_STATUSES.PAYMENT_CONFIRMED;

  return {
    code: normalizedKey,
    label: raw,
    description: `Current status: ${raw}`,
    tone: "amber",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    bgClass: "bg-amber-500",
    textClass: "text-amber-800",
    timelineStage: 3,
    isTerminal: false,
    isException: false,
  };
}

/**
 * Determines whether a given milestone stage has been reached or completed
 */
export function isMilestoneCompleted(currentStatusConfig, milestoneStage) {
  if (!currentStatusConfig) return false;
  if (currentStatusConfig.code === "CANCELLED") return false;
  return currentStatusConfig.timelineStage >= milestoneStage;
}

export function isCurrentMilestone(currentStatusConfig, milestoneStage) {
  if (!currentStatusConfig) return false;
  if (currentStatusConfig.code === "CANCELLED") return false;
  return currentStatusConfig.timelineStage === milestoneStage;
}
