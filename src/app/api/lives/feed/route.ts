export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getLivesFeedYear } from "@/entities/live/api";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const year = searchParams.get("year") ?? "";
  const dir = searchParams.get("dir") === "forward" ? "forward" : "reverse";

  if (!/^\d{4}$/.test(year)) {
    return NextResponse.json({ error: "Invalid year" }, { status: 400 });
  }

  try {
    const data = await getLivesFeedYear(year, dir);
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
