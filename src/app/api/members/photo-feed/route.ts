import { NextRequest, NextResponse } from "next/server";
import { getPhotosGroupedByLive } from "@/entities/photo/api";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const memberId = searchParams.get("memberId");

  try {
    const data = await getPhotosGroupedByLive(memberId);
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
