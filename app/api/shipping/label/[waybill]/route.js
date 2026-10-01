import { NextResponse } from "next/server";

export async function GET(request, context) {
  try {
    const params = await context.params;
    const waybill = params?.waybill;
    const cleanWaybill = String(waybill || "").trim();

    if (!cleanWaybill) {
      return NextResponse.json({ success: false, error: "Waybill is required" }, { status: 400 });
    }

    const backendUrl = (process.env.NEXT_PUBLIC_API_BACKEND_URL || "http://localhost:8000").replace(/\/+$/, "");

    const backendRes = await fetch(`${backendUrl}/api/shipping/label/${encodeURIComponent(cleanWaybill)}`, {
      signal: AbortSignal.timeout(10000),
    });

    if (!backendRes.ok) {
      const errJson = await backendRes.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, error: errJson.message || "Failed to download shipping label" },
        { status: backendRes.status }
      );
    }

    const contentType = backendRes.headers.get("content-type") || "application/pdf";
    const buffer = await backendRes.arrayBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="delhivery-label-${cleanWaybill}.pdf"`,
      },
    });
  } catch (error) {
    console.error("[label proxy error]:", error.message);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to download label" },
      { status: 500 }
    );
  }
}
