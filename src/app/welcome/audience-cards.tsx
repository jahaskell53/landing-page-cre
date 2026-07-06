"use client";

import { type ReactNode, useEffect, useState } from "react";
import { motion } from "motion/react";
import { SignupCtaButton } from "./signup-cta";

const EMPHASIS = "font-semibold text-blue-900 dark:text-blue-400";

type Audience = {
    // URL hash slug used for deep-linking from the nav (e.g. /welcome#brokers).
    id: string;
    title: string;
    headline: string;
    body: ReactNode;
};

const AUDIENCES: Audience[] = [
    {
        id: "owners",
        title: "Property owners",
        headline: "Leverage AI to unlock smarter insights and superior returns.",
        body: (
            <>
                OpenMidmarket <span className={EMPHASIS}>levels the playing field</span> for midmarket multifamily investors by providing AI-native,
                institutional-grade tools. Through unified real-time data, smart analytics, trusted networks, and exclusive preferred member pricing, you{" "}
                <span className={EMPHASIS}>unlock unique investment opportunities, maximize your returns, and build industry leverage</span>.
            </>
        ),
    },
    {
        id: "brokers",
        title: "CRE brokers",
        headline: "Close more deals. Earn higher commissions.",
        body: (
            <>
                OpenMidmarket <span className={EMPHASIS}>empowers</span> brokers with AI-native underwriting tools, automated campaigns, real-time data, an
                intelligent CRM, and market analytics—
                <span className={EMPHASIS}>accelerating deals, strengthening relationships, and growing commissions</span>.
            </>
        ),
    },
    {
        id: "lenders",
        title: "CRE lenders",
        headline: "Deploy more capital. Fast-track your loan execution.",
        body: (
            <>
                OpenMidmarket <span className={EMPHASIS}>empowers</span> lenders with AI-native underwriting tools, real-time data rooms, an intelligent pipeline
                manager, and market analytics—
                <span className={EMPHASIS}>accelerating loan cycles, mitigating risk, and scaling origination volume</span>.
            </>
        ),
    },
    {
        id: "property-managers",
        title: "Property managers",
        headline: "Operate with peak efficiency. Scale your management portfolio.",
        body: (
            <>
                OpenMidmarket <span className={EMPHASIS}>empowers</span> property managers with AI-native workflow automation, real-time owner reporting dashboards,
                and dynamic market insights—
                <span className={EMPHASIS}>eliminating operational friction, delighting property owners, and securing more properties to manage</span>.
            </>
        ),
    },
    {
        id: "appraisers",
        title: "Appraisers",
        headline: "Accelerate valuation turnaround. Deliver bulletproof accuracy.",
        body: (
            <>
                OpenMidmarket <span className={EMPHASIS}>empowers</span> appraisers with AI-native data extraction, real-time transaction tracking, localized market
                analytics, and intelligent comp verification—
                <span className={EMPHASIS}>eliminating manual research friction, streamlining workflow execution, and scaling report volume</span>.
            </>
        ),
    },
    {
        id: "insurance-agents",
        title: "Insurance agents",
        headline: "Accelerate speed-to-quote. Bind coverage with confidence.",
        body: (
            <>
                OpenMidmarket <span className={EMPHASIS}>empowers</span> insurance agents with AI-native risk data extraction, real-time property specification
                tracking, localized hazard analytics, and unified exposure mapping—
                <span className={EMPHASIS}>eliminating manual underwriting friction, optimizing policy placement, and winning more premium volume</span>.
            </>
        ),
    },
    {
        id: "1031-advisors",
        title: "1031 advisors",
        headline: "Beat the identification clock. Protect client wealth.",
        body: (
            <>
                OpenMidmarket <span className={EMPHASIS}>empowers</span> 1031 advisors with AI-native replacement property matching, real-time midmarket inventory
                tracking, automated timeline compliance alerts, and unified transaction intelligence—
                <span className={EMPHASIS}>eliminating manual sourcing friction, securing eligible uplegs faster, and scaling transaction volume</span>.
            </>
        ),
    },
];

const COUNT = AUDIENCES.length;
const AUTO_ROTATE_MS = 5000;

export function AudienceCards() {
    const [activeIndex, setActiveIndex] = useState(0);
    // Once the visitor takes control (tab click or deep link), stop showcasing.
    const [interacted, setInteracted] = useState(false);

    // Cycle through audiences on a timer until the visitor takes control.
    useEffect(() => {
        if (interacted) return;
        const id = setInterval(() => {
            setActiveIndex((current) => (current + 1) % COUNT);
        }, AUTO_ROTATE_MS);
        return () => clearInterval(id);
    }, [interacted, activeIndex]);

    // Deep-linking: /welcome#brokers (from the nav) selects that audience and
    // scrolls the section into view. Runs on mount and on every hash change so
    // clicking a nav item while already on the page works too.
    useEffect(() => {
        function selectFromHash() {
            const slug = window.location.hash.replace(/^#/, "");
            const index = AUDIENCES.findIndex((audience) => audience.id === slug);
            if (index === -1) return;
            setInteracted(true);
            setActiveIndex(index);
            document.getElementById("audiences")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        selectFromHash();
        window.addEventListener("hashchange", selectFromHash);
        return () => window.removeEventListener("hashchange", selectFromHash);
    }, []);

    const selectTab = (index: number) => {
        setInteracted(true);
        setActiveIndex(index);
    };

    return (
        <div className="mt-16">
            <div role="tablist" className="flex gap-6 overflow-x-auto border-b border-gray-200 pb-px dark:border-gray-800">
                {AUDIENCES.map(({ title }, index) => {
                    const isActive = index === activeIndex;
                    return (
                        <button
                            key={title}
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => selectTab(index)}
                            className={
                                "-mb-px cursor-pointer border-b-2 pb-4 text-sm font-medium tracking-wide uppercase transition-colors " +
                                (isActive
                                    ? "border-blue-900 text-blue-900 dark:border-blue-400 dark:text-blue-400"
                                    : "border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100")
                            }
                        >
                            {title}
                        </button>
                    );
                })}
            </div>
            {/* All panels stay mounted and stacked in the same grid cell so the
                container's height is always the tallest panel — swapping the
                active one never reflows the sections below. */}
            <div className="grid">
                {AUDIENCES.map(({ title, headline, body }, index) => {
                    const isActive = index === activeIndex;
                    return (
                        <motion.div
                            key={title}
                            role="tabpanel"
                            aria-hidden={!isActive}
                            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 8 }}
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                            className={"col-start-1 row-start-1 max-w-2xl py-16 " + (isActive ? "" : "pointer-events-none")}
                        >
                            <h3 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">{headline}</h3>
                            <p className="mt-4 text-lg leading-relaxed text-gray-600 dark:text-gray-400">{body}</p>
                            <SignupCtaButton
                                className="mt-8"
                                trackingLocation="audience_get_started"
                                audience={AUDIENCES[index].id}
                                tabIndex={isActive ? 0 : -1}
                            />
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
