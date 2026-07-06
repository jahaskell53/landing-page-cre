import { NextRequest, NextResponse } from "next/server";
import { APP_ORIGIN } from "@/lib/app-origin";

/**
 * Same-origin proxy to the app's public `/api/waitlist` (avoids browser CORS and
 * keeps the marketing site free of database credentials). Mirrors `/api/rpc`.
 */
export async function POST(req: NextRequest) {
    const body = await req.text();

    const response = await fetch(`${APP_ORIGIN}/api/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
    });

    return new NextResponse(await response.text(), {
        status: response.status,
        headers: {
            "Content-Type": response.headers.get("Content-Type") ?? "application/json",
        },
    });
}
