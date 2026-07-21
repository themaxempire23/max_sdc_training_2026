import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const apiUrl = process.env.API_URL ?? "http://127.0.0.1:8000";

  try {
    const payload = await request.json();
    const response = await fetch(`${apiUrl}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { detail: "The model API is unavailable. Check that the backend is running." },
      { status: 503 },
    );
  }
}
