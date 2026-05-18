export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getPhotosGroupedByLivePaginated } from "@/entities/photo/api";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const memberId = searchParams.get("memberId");
  const page = parseInt(searchParams.get("page") ?? "0", 10);

  try {
    const data = await getPhotosGroupedByLivePaginated(memberId, page);
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
