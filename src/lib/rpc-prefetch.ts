import { APP_ORIGIN } from "@/lib/app-origin";
import { stableStringify } from "@/db/rpc/trends-rpc-client";

/** Server-side POST to the public app RPC proxy (no Supabase credentials required). */
export async function fetchPublicRpc<T>(fn: string, params: object): Promise<T> {
    const response = await fetch(`${APP_ORIGIN}/api/rpc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fn, params }),
        next: { revalidate: 3600, tags: ["rpc-cache", `rpc-cache:${fn}`, `rpc-cache:${fn}:${stableStringify(params)}`] },
    });

    if (!response.ok) {
        throw new Error(`RPC ${fn} failed (${response.status})`);
    }

    return response.json() as Promise<T>;
}
