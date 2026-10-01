import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const pincode = body?.pincode;
    const cleanPin = String(pincode || "").trim().replace(/\D/g, "");

    if (!cleanPin || cleanPin.length !== 6) {
      return NextResponse.json(
        { success: false, error: "Invalid 6-digit pincode" },
        { status: 400 }
      );
    }

    const backendUrl = (process.env.NEXT_PUBLIC_API_BACKEND_URL || "http://localhost:8000").replace(/\/+$/, "");

    const backendRes = await fetch(`${backendUrl}/api/shipping/check-pincode`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pincode: cleanPin }),
      signal: AbortSignal.timeout(8000),
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("[check-pincode proxy error]:", error.message);
    // Graceful fallback for offline dev
    return NextResponse.json({
      success: true,
      data: {
        pincode: "",
        serviceable: true,
        codAvailable: true,
        prepaidAvailable: true,
        pickupAvailable: true,
        simulated: true,
      },
    });
  }
}
