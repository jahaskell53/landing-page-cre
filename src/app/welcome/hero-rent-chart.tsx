import { HeroRentTrendsCard } from "./rent-trends-preview";
import { PREVIEW_RENT_RESULTS } from "./rent-trends-preview-config";
import { getWelcomeRentTrends } from "./rent-trends-server";

export async function HeroRentChart() {
    const live = await getWelcomeRentTrends();
    return <HeroRentTrendsCard areaResults={live ?? PREVIEW_RENT_RESULTS} />;
}
