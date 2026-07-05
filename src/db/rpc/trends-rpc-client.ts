import { apiFetch } from "@/lib/api/api-fetch";

/**
 * Shared client-side fetch helper for the read-only **trend** RPCs
 * (rent / sales / map / market-activity). It POSTs `{ fn, params }` to
 * `/api/rpc` exactly like the previous per-file `rpc()` helpers did, but adds
 * two lightweight, dependency-free optimizations scoped to these reads:
 *
 *   1. **In-flight dedupe** — concurrent identical `(fn, params)` requests share
 *      a single Promise instead of each hitting the network.
 *   2. **Short TTL cache** — a resolved result is reused for `TREND_RPC_TTL_MS`
 *      so repeated reads within a session (e.g. re-selecting the same area) do
 *      not refetch.
 *
 * This mirrors the server-side `unstable_cache` added in `app/api/rpc/route.ts`
 * for the same allowlisted trend functions: because the proxy uses the
 * service-role admin client, `(fn, params)` returns identical data for every
 * user, so caching by that key is safe.
 *
 * Intentionally minimal: no React Query, no provider, no change to wrapper call
 * signatures. Requests that pass an AbortSignal (`options.signal`) bypass the
 * cache so cancellation semantics are preserved.
 */

/** TTL for cached trend results (5 minutes). */
export const TREND_RPC_TTL_MS = 5 * 60 * 1000;

interface CacheEntry<T> {
    value: T;
    expiresAt: number;
}

// Module-scoped caches. Keyed by `(fn, stableStringify(params))`.
const inFlight = new Map<string, Promise<unknown>>();
const resolved = new Map<string, CacheEntry<unknown>>();

/**
 * Deterministic JSON stringify: object keys are emitted in sorted order at
 * every level so that `{ a: 1, b: 2 }` and `{ b: 2, a: 1 }` produce the same
 * cache key. Arrays preserve order (order is significant for params like
 * `p_neighborhood_ids`).
 */
export function stableStringify(value: unknown): string {
    return JSON.stringify(sortValue(value));
}

function sortValue(value: unknown): unknown {
    if (Array.isArray(value)) {
        return value.map(sortValue);
    }
    if (value && typeof value === "object") {
        const out: Record<string, unknown> = {};
        for (const key of Object.keys(value as Record<string, unknown>).sort()) {
            out[key] = sortValue((value as Record<string, unknown>)[key]);
        }
        return out;
    }
    return value;
}

async function postRpc<T>(fn: string, params: object, signal?: AbortSignal): Promise<T> {
    return apiFetch<T>("/api/rpc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fn, params }),
        signal,
    });
}

/**
 * Fetch an allowlisted trend RPC with in-flight dedupe + TTL caching.
 * Abortable requests (those passing a signal) skip the cache entirely.
 */
export async function callTrendRpc<T>(fn: string, params: object, options?: { signal?: AbortSignal }): Promise<T> {
    if (options?.signal) {
        return postRpc<T>(fn, params, options.signal);
    }

    const key = `${fn}::${stableStringify(params)}`;
    const now = Date.now();

    const cached = resolved.get(key);
    if (cached && cached.expiresAt > now) {
        return cached.value as T;
    }
    if (cached) {
        resolved.delete(key);
    }

    const existing = inFlight.get(key);
    if (existing) {
        return existing as Promise<T>;
    }

    const promise = postRpc<T>(fn, params)
        .then((value) => {
            resolved.set(key, { value, expiresAt: Date.now() + TREND_RPC_TTL_MS });
            return value;
        })
        .finally(() => {
            inFlight.delete(key);
        });

    inFlight.set(key, promise);
    return promise;
}

/** Test helper: clear both caches so tests start from a clean slate. */
export function __clearTrendRpcCache(): void {
    inFlight.clear();
    resolved.clear();
}
