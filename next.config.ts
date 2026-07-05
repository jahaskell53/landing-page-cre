import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async redirects() {
        return [
            { source: "/welcome", destination: "/", permanent: true },
            { source: "/brokers", destination: "/#brokers", permanent: true },
            { source: "/lenders", destination: "/#lenders", permanent: true },
            { source: "/owners", destination: "/#owners", permanent: true },
        ];
    },
    async rewrites() {
        return [
            {
                source: "/ph/static/:path*",
                destination: "https://us-assets.i.posthog.com/static/:path*",
            },
            {
                source: "/ph/array/:path*",
                destination: "https://us-assets.i.posthog.com/array/:path*",
            },
            {
                source: "/ph/:path*",
                destination: "https://us.i.posthog.com/:path*",
            },
        ];
    },
    skipTrailingSlashRedirect: true,
};

export default nextConfig;
