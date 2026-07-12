import posthog from "posthog-js";
import { isPostHogEnabled, POSTHOG_PROJECT_TOKEN } from "@/lib/posthog-config";

if (isPostHogEnabled && POSTHOG_PROJECT_TOKEN) {
    posthog.init(POSTHOG_PROJECT_TOKEN, {
        api_host: "/ph",
        ui_host: "https://us.posthog.com",
        defaults: "2026-05-30",
        capture_exceptions: true,
        debug: false,
    });
}
