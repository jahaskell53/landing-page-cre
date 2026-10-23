"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useMapboxStyle } from "@/hooks/use-mapbox-style";
import { getMapboxStyle } from "@/lib/mapbox-style";
import { MAPBOX_TOKEN } from "@/lib/mapbox-token";

mapboxgl.accessToken = MAPBOX_TOKEN;

export interface LeadsMapPin {
    coordinates: [number, number];
    /** Hex fill for the pin. */
    color: string;
    /** "sale" pins render as hollow rings so sold comps read differently from listings. */
    kind: "listing" | "sale";
    selected?: boolean;
}

const SOURCE = "leads-pins";
const LISTING_LAYER = "leads-listing-pins";
const SALE_LAYER = "leads-sale-pins";

/** Static, non-interactive Mapbox map for the leads showcase mockup. */
export function LeadsListingsMap({ pins, center, zoom }: { pins: readonly LeadsMapPin[]; center: [number, number]; zoom: number }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const style = useMapboxStyle("standard");
    const isDark = style !== getMapboxStyle(false, "standard");

    useEffect(() => {
        if (!containerRef.current || !MAPBOX_TOKEN) return;

        const map = new mapboxgl.Map({
            container: containerRef.current,
            style,
            center,
            zoom,
            interactive: false,
            attributionControl: false,
        });
        map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-left");

        const ring = isDark ? "#0b1220" : "#ffffff";
        map.on("load", () => {
            map.addSource(SOURCE, {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: pins.map((pin) => ({
                        type: "Feature",
                        geometry: { type: "Point", coordinates: pin.coordinates },
                        properties: {
                            color: pin.color,
                            kind: pin.kind,
                            selected: Boolean(pin.selected),
                        },
                    })),
                },
            });
            map.addLayer({
                id: SALE_LAYER,
                type: "circle",
                source: SOURCE,
                filter: ["==", ["get", "kind"], "sale"],
                paint: {
                    "circle-color": ring,
                    "circle-radius": 5,
                    "circle-stroke-width": 2.5,
                    "circle-stroke-color": ["get", "color"],
                },
            });
            map.addLayer({
                id: LISTING_LAYER,
                type: "circle",
                source: SOURCE,
                filter: ["==", ["get", "kind"], "listing"],
                paint: {
                    "circle-color": ["get", "color"],
                    "circle-radius": ["case", ["get", "selected"], 9, 6],
                    "circle-stroke-width": ["case", ["get", "selected"], 3, 2],
                    "circle-stroke-color": ring,
                },
            });
        });

        // The map can mount while its mockup is still hidden or resizing.
        const resize = new ResizeObserver(() => map.resize());
        resize.observe(containerRef.current);

        return () => {
            resize.disconnect();
            map.remove();
        };
    }, [pins, center, zoom, style, isDark]);

    // Mapbox sets `position: relative` on its container, so positioning lives on a wrapper.
    return (
        <div className="absolute inset-0">
            <div ref={containerRef} className="size-full" />
        </div>
    );
}
