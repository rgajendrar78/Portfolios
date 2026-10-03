import type { MetadataRoute } from "next";
import { portfolio } from "@/config/portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: portfolio.site.url, changeFrequency: "monthly", priority: 1 }];
}
