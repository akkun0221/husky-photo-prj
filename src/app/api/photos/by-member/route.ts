import { NextRequest, NextResponse } from "next/server";
import { getPhotosByMemberId } from "@/entities/photo/api";

const PAGE_SIZE = 24;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const memberId = searchParams.get("memberId");
  const page = Number(searchParams.get("page") ?? "0");

  if (!memberId) {
    return NextResponse.json(
      { error: "memberId is required" },
      { status: 400 },
    );
  }

  try {
    const photos = await getPhotosByMemberId(memberId, {
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    });
    return NextResponse.json(photos);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
