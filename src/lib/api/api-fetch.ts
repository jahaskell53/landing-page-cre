export type ApiErrorBody = {
    error: string;
};

export class ApiFetchError extends Error {
    readonly status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = "ApiFetchError";
        this.status = status;
    }
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
    return typeof value === "object" && value !== null && typeof (value as ApiErrorBody).error === "string";
}

async function readErrorMessage(response: Response): Promise<string> {
    const fallback = response.statusText || "Request failed";

    try {
        const body: unknown = await response.json();
        if (isApiErrorBody(body)) {
            return body.error;
        }
    } catch {
        // Ignore JSON parse errors and use the fallback message.
    }

    return fallback;
}

import { APP_ORIGIN } from "@/lib/app-origin";

/**
 * Typed fetch wrapper for app `/api/*` routes (cross-origin on the marketing site).
 * Throws `ApiFetchError` on non-2xx responses using the `{ error }` envelope from `withApiRoute`.
 */
export async function apiFetch<T>(path: string, opts?: RequestInit): Promise<T> {
    const url = path.startsWith("/") ? `${APP_ORIGIN}${path}` : path;
    const response = await fetch(url, {
        credentials: "omit",
        ...opts,
    });

    if (!response.ok) {
        throw new ApiFetchError(await readErrorMessage(response), response.status);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    const contentLength = response.headers?.get("content-length");
    if (contentLength === "0") {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}
