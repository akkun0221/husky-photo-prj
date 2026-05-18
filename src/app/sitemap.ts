import type { MetadataRoute } from "next";
import { getLives } from "@/entities/live/api";

const BASE_URL = "https://husky-photo-prj.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lives = await getLives();

  const liveEntries: MetadataRoute.Sitemap = lives.map((live) => ({
    url: `${BASE_URL}/lives/${live.id}`,
    lastModified: new Date(live.date.replaceAll(".", "-")),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/lives`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/members`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...liveEntries,
  ];
}
