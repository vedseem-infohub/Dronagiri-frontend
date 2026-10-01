import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const backendUrl = (process.env.NEXT_PUBLIC_API_BACKEND_URL || "http://localhost:8000").replace(/\/+$/, "");

    const backendRes = await fetch(`${backendUrl}/api/shipping/calculate-cost`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("[calculate-cost proxy error]:", error.message);
    return NextResponse.json({
      success: true,
      data: {
        totalShippingCost: 60,
        totalAmount: 60,
        shippingCharge: 60,
        baseCharge: 60,
        codCharge: 0,
        codCharges: 0,
        currency: "INR",
        estimatedDays: 3,
        fallback: true,
      },
    });
  }
}

export async function GET(request) {
  try {
    const { search } = new URL(request.url);
    const backendUrl = (process.env.NEXT_PUBLIC_API_BACKEND_URL || "http://localhost:8000").replace(/\/+$/, "");

    const backendRes = await fetch(`${backendUrl}/api/shipping/calculate-cost${search}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("[calculate-cost proxy error]:", error.message);
    return NextResponse.json({
      success: true,
      data: {
        totalShippingCost: 60,
        totalAmount: 60,
        shippingCharge: 60,
        baseCharge: 60,
        codCharge: 0,
        codCharges: 0,
        currency: "INR",
        estimatedDays: 3,
        fallback: true,
      },
    });
  }
}
