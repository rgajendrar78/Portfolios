import { ImageResponse } from "next/og";
import { portfolio } from "@/config/portfolio";

const { person, site, theme } = portfolio;

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The link preview recruiters see when the site is shared.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: theme.light.bg,
          color: theme.light.ink,
        }}
      >
        <div style={{ fontSize: 34, opacity: 0.85 }}>{person.role}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 104, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>
            {person.name}
          </div>
          <div style={{ marginTop: 28, fontSize: 32, opacity: 0.85, maxWidth: 900 }}>
            {site.description}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
