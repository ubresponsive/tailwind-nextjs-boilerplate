import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        padding: 80,
        background: "linear-gradient(135deg, #1e3a8a 0%, #4338ca 100%)",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>
        {siteConfig.name}
      </div>
      <div style={{ marginTop: 24, fontSize: 30, opacity: 0.9, maxWidth: 900 }}>
        {siteConfig.description}
      </div>
    </div>,
    { ...size },
  );
}
