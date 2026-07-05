"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

// Cinematic full-bleed video panel shared by the "Together, stronger." slogan
// and closing CTA sections: the background video drifts and slowly zooms as
// the panel scrolls through the viewport (classic parallax), and the content
// fades/rises in on first view. All motion is skipped for
// prefers-reduced-motion via Framer's built-in reduced-motion handling.
export function VideoPanel({
    videoSrc,
    posterSrc,
    children,
    footer,
}: {
    videoSrc: string;
    posterSrc: string;
    children: React.ReactNode;
    // Optional content layered over the bottom of the footage (e.g. copyright).
    footer?: React.ReactNode;
}) {
    const sectionRef = useRef<HTMLElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });
    const videoY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
    const videoScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.05, 1.15]);

    return (
        <section
            ref={sectionRef}
            className="relative grid min-h-screen place-items-center overflow-hidden border-b border-gray-200 dark:border-gray-800"
        >
            <motion.video
                ref={videoRef}
                className="absolute inset-0 size-full object-cover"
                style={{ y: videoY, scale: videoScale }}
                src={videoSrc}
                poster={posterSrc}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-hidden
                onLoadedMetadata={() => {
                    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) videoRef.current?.pause();
                }}
            />

            {/* Base tint for text contrast against the footage. */}
            <div aria-hidden className="absolute inset-0 bg-black/25" />

            <motion.div
                className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-start px-4 py-32 text-left sm:px-6 lg:px-8"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15% 0px" }}
                transition={{ duration: 0.9, ease: "easeOut" }}
            >
                {children}
            </motion.div>

            {footer && <div className="absolute inset-x-0 bottom-0 z-10 px-6 py-6 text-center text-sm text-white/60">{footer}</div>}
        </section>
    );
}
