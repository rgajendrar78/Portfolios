import type { MetadataRoute } from "next";
import { portfolio } from "@/config/portfolio";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", portfolio.site.url).toString(),
  };
}
