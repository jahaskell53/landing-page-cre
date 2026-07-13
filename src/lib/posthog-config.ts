export const POSTHOG_PROJECT_TOKEN = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

/** PostHog must only run on the production Vercel deployment. */
export const isPostHogEnabled =
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production" && Boolean(POSTHOG_PROJECT_TOKEN);
