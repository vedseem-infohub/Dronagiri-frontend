import { NextResponse } from "next/server";

export async function GET(request, context) {
  try {
    const params = await context.params;
    const pincode = params?.pincode;
    const cleanPin = String(pincode || "").trim().replace(/\D/g, "");

    if (!cleanPin || cleanPin.length !== 6) {
      return NextResponse.json(
        { success: false, error: "Invalid 6-digit pincode" },
        { status: 400 }
      );
    }

    const backendUrl = (process.env.NEXT_PUBLIC_API_BACKEND_URL || "http://localhost:8000").replace(/\/+$/, "");

    const backendRes = await fetch(`${backendUrl}/api/shipping/serviceability/${cleanPin}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("[serviceability proxy error]:", error.message);
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
