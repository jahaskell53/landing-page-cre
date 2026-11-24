"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { AUDIENCE_PAGE_LIST } from "@/lib/audience-pages";
import { captureAudienceTabSelected } from "@/lib/tracking";
import { PreviewNativeSelect } from "./preview-native-select";
import { SignupCtaButton } from "./signup-cta";

const AUDIENCES = AUDIENCE_PAGE_LIST.map((page) => ({
    id: page.slug,
    title: page.label,
    headline: page.cardHeadline,
    body: page.cardBody,
}));

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

    // Deep-linking: /#brokers selects that audience and scrolls the section into view.
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
                {AUDIENCES.map(({ id, title, headline, body }, index) => {
                    const isActive = index === activeIndex;
                    return (
                        <motion.div
                            key={id}
                            aria-hidden={!isActive}
                            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 8 }}
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                            className={"col-start-1 row-start-1 max-w-2xl py-16 " + (isActive ? "" : "pointer-events-none")}
                        >
                            <h3 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">{headline}</h3>
                            <p className="mt-4 text-lg leading-relaxed text-gray-600 dark:text-gray-400">{body}</p>
                            <div className="mt-8 flex flex-wrap items-center gap-5">
                                <SignupCtaButton
                                    trackingLocation="audience_get_started"
                                    audience={id}
                                    tabIndex={isActive ? 0 : -1}
                                />
                                <Link
                                    href={`/${id}`}
                                    tabIndex={isActive ? 0 : -1}
                                    className="text-sm font-semibold text-blue-900 underline-offset-4 hover:underline dark:text-blue-400"
                                >
                                    See how it works for {title.toLowerCase()} →
                                </Link>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
