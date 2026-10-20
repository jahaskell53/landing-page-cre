import { HomepageJsonLd } from "./welcome/homepage-json-ld";
import { LandingHome, homepageMetadata } from "./welcome/landing-home";

export const revalidate = 3600;
export const metadata = homepageMetadata;

export default function HomePage() {
    return (
        <>
            <HomepageJsonLd />
            <LandingHome />
        </>
    );
}
