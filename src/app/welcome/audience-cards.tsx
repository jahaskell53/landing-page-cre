"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { captureAudienceTabSelected } from "@/lib/tracking";
import { PreviewNativeSelect } from "./preview-native-select";
import { SignupCtaButton } from "./signup-cta";

type Audience = {
    // URL hash slug used for deep-linking from the nav (e.g. /welcome#brokers).
    id: string;
    title: string;
    headline: string;
    body: string;
};

const AUDIENCES: Audience[] = [
    {
        id: "owners",
        title: "Property owners",
        headline: "Smarter decisions. Better returns.",
        body: "Real-time rent and sales data, plus a network of owners like you, so you can spot deals and grow your portfolio.",
    },
    {
        id: "brokers",
        title: "CRE brokers",
        headline: "Close more deals. Earn more.",
        body: "Underwrite faster, stay in touch with owners, and track your market, all in one place.",
    },
    {
        id: "lenders",
        title: "CRE lenders",
        headline: "Close loans faster.",
        body: "Underwrite deals quickly with live market data and keep your pipeline moving.",
    },
    {
        id: "property-managers",
        title: "Property managers",
        headline: "Run leaner. Win more doors.",
        body: "Automate owner reports and track your market so you can take on more properties.",
    },
    {
        id: "appraisers",
        title: "Appraisers",
        headline: "Faster, more accurate valuations.",
        body: "Pull and check comps in minutes instead of hours.",
    },
    {
        id: "insurance-agents",
        title: "Insurance agents",
        headline: "Quote faster. Bind with confidence.",
        body: "Get property details and local risk data without the manual digging.",
    },
    {
        id: "1031-advisors",
        title: "1031 advisors",
        headline: "Beat the 45-day clock.",
        body: "Find eligible replacement properties fast and stay on top of every deadline.",
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

    const selectAudience = (index: number) => {
        setInteracted(true);
        setActiveIndex(index);
        captureAudienceTabSelected(AUDIENCES[index].id, AUDIENCES[index].title, index);
    };

    return (
        <div className="mt-16">
            <label htmlFor="audience-select" className="sr-only">
                Audience
            </label>
            <PreviewNativeSelect
                id="audience-select"
                alwaysShow
                aria-label="Audience"
                value={AUDIENCES[activeIndex].id}
                onChange={(id) => {
                    const index = AUDIENCES.findIndex((audience) => audience.id === id);
                    if (index === -1) return;
                    selectAudience(index);
                }}
                options={AUDIENCES.map((audience) => ({ value: audience.id, label: audience.title }))}
                className="border border-gray-200 bg-white pr-8 pl-3 font-normal tracking-normal normal-case dark:border-gray-700 dark:bg-transparent"
            />
            {/* All panels stay mounted and stacked in the same grid cell so the
                container's height is always the tallest panel — swapping the
                active one never reflows the sections below. */}
            <div className="grid">
                {AUDIENCES.map(({ title, headline, body }, index) => {
                    const isActive = index === activeIndex;
                    return (
                        <motion.div
                            key={title}
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
