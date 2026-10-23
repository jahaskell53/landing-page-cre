import { Building2, FileText, TrendingUp } from "lucide-react";
import { SignupCtaButton } from "./signup-cta";

const LEADS_BENEFITS = [
    {
        icon: FileText,
        title: "Open the conversation with a rent survey for their building",
        body: "Enter an address and get low, median, and high rent by unit type plus top comps. Add the Rent Gap PDF to show the owner their rent upside.",
    },
    {
        icon: TrendingUp,
        title: "Stay top of mind with market updates",
        body: "Send rent trends by area and comps in PDF or Excel, or pull them up on a live client call.",
    },
    {
        icon: Building2,
        title: "Find buildings and buyers for your clients",
        body: "Search the listings map and OMs by brokerage, then see who bought nearby with named buyers on sales comps.",
    },
];

export function LeadsBenefits() {
    return (
        <section className="bg-white dark:bg-gray-950">
            <div className="mx-auto max-w-6xl px-4 py-32 sm:px-6 lg:px-8">
                <p className="text-sm font-semibold tracking-[0.08em] text-blue-900 uppercase dark:text-blue-400">FOR CRE BROKERS</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
                    From first call to closed deal
                </h2>
                <div className="mt-12 grid gap-12 sm:grid-cols-3">
                    {LEADS_BENEFITS.map((item) => (
                        <div key={item.title}>
                            <item.icon className="size-8 text-blue-900 dark:text-blue-400" />
                            <h3 className="mt-4 text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">{item.title}</h3>
                            <p className="mt-2 text-base leading-relaxed text-gray-600 dark:text-gray-400">{item.body}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-12 flex justify-center">
                    <SignupCtaButton trackingLocation="value_pillars_get_started" />
                </div>
            </div>
        </section>
    );
}
