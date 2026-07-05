"use client";

import { useEffect, useState } from "react";
import { MAP_ZOOM_EVENT } from "./market-map";

// The "mid-market" badge. Its reveal is held until the hero map fires
// MAP_ZOOM_EVENT (the opening camera fly-in), so the badge and the zoom
// read as one synchronized gesture. A fallback timer covers the case where the
// map never loads (e.g. missing Mapbox token).
export function HeroHighlight({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    const [drawing, setDrawing] = useState(false);

    useEffect(() => {
        const start = () => setDrawing(true);
        window.addEventListener(MAP_ZOOM_EVENT, start);
        const fallback = setTimeout(start, 2500);
        return () => {
            window.removeEventListener(MAP_ZOOM_EVENT, start);
            clearTimeout(fallback);
        };
    }, []);

    return <span className={`hero-highlight-badge ${drawing ? "is-drawing" : ""} ${className}`.trim()}>{children}</span>;
}
