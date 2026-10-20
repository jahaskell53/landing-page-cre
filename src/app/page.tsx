import { LandingHome, landingMetadata } from "./welcome/landing-home";

export const revalidate = 3600;
export const metadata = landingMetadata;

export default function HomePage() {
    return <LandingHome />;
}
