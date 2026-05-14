import { NextRequest, NextResponse } from "next/server";
import { getPhotosByLiveAndMember } from "@/entities/photo/api";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const liveId = searchParams.get("liveId");
  const memberId = searchParams.get("memberId");
  const page = Number(searchParams.get("page") ?? "0");

  if (!liveId) {
    return NextResponse.json({ error: "liveId is required" }, { status: 400 });
  }

  try {
    const photos = await getPhotosByLiveAndMember(liveId, memberId, {
      limit: 24,
      page,
    });
    return NextResponse.json(photos);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
