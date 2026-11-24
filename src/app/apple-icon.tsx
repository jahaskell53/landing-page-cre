import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "OpenMidmarket";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
                borderRadius: "36px",
                fontSize: 92,
                fontWeight: 700,
                letterSpacing: "-0.04em",
                fontFamily: "sans-serif",
            }}
        >
            OM
        </div>,
        { ...size },
    );
}
