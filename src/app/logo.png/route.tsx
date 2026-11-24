import { ImageResponse } from "next/og";

export const runtime = "edge";

/** Deterministic 512x512 square PNG brand mark for Organization JSON-LD (`https://www.openmidmarket.com/logo.png`). */
export function GET() {
    return new ImageResponse(
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#1e3a8a",
                color: "#ffffff",
                borderRadius: "96px",
                fontSize: 260,
                fontWeight: 700,
                letterSpacing: "-0.04em",
                fontFamily: "sans-serif",
            }}
        >
            OM
        </div>,
        {
            width: 512,
            height: 512,
            headers: {
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        },
    );
}
