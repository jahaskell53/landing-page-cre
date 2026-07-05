import { NextRequest, NextResponse } from "next/server";
import { APP_ORIGIN } from "@/lib/app-origin";

/** Same-origin proxy to the app's public `/api/rpc` (avoids browser CORS). */
export async function POST(req: NextRequest) {
    const body = await req.text();

    const response = await fetch(`${APP_ORIGIN}/api/rpc`, {
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
