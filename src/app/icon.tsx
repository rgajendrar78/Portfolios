import { ImageResponse } from "next/og";
import { portfolio } from "@/config/portfolio";
import { initials } from "@/lib/derive";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  const { ink, bg } = portfolio.theme.light;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 14,
          background: ink,
          color: bg,
          fontSize: 30,
          fontWeight: 700,
        }}
      >
        {initials(portfolio.person.name)}
      </div>
    ),
    size,
  );
}
