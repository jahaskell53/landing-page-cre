"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useMapboxStyle } from "@/hooks/use-mapbox-style";
import { getMapboxStyle } from "@/lib/mapbox-style";

import { MAPBOX_TOKEN } from "@/lib/mapbox-token";

mapboxgl.accessToken = MAPBOX_TOKEN;

// Sample mid-market multifamily signals for the public landing page. This is
// illustrative marketing data — the real, authenticated map lives in
// /analytics/rent-trends and reads live closed-sale comps via RPC. Keeping this
// self-contained means the welcome page needs no auth, no data fetch, and no
// server round-trip (mirrors the mocked <AppPreview />).
type MarketPoint = {
    city: string;
    coordinates: [number, number];
    perDoor: number;
    pctChange: number;
};

const MARKET_POINTS: MarketPoint[] = [
    // San Francisco / Peninsula
    { city: "San Francisco", coordinates: [-122.4194, 37.7749], perDoor: 312000, pctChange: -4.2 },
    { city: "Daly City", coordinates: [-122.4702, 37.6879], perDoor: 186000, pctChange: 4.5 },
    { city: "San Mateo", coordinates: [-122.3255, 37.563], perDoor: 267000, pctChange: 1.2 },
    { city: "Redwood City", coordinates: [-122.2364, 37.4852], perDoor: 283000, pctChange: -2.9 },
    { city: "Palo Alto", coordinates: [-122.143, 37.4419], perDoor: 398000, pctChange: -3.7 },
    // East Bay
    { city: "Richmond", coordinates: [-122.3477, 37.9358], perDoor: 157000, pctChange: 9.4 },
    { city: "Berkeley", coordinates: [-122.2729, 37.8715], perDoor: 264000, pctChange: -1.5 },
    { city: "Oakland", coordinates: [-122.2712, 37.8044], perDoor: 198000, pctChange: 6.1 },
    { city: "Alameda", coordinates: [-122.2416, 37.7652], perDoor: 221000, pctChange: 3.8 },
    { city: "San Leandro", coordinates: [-122.1561, 37.7249], perDoor: 183000, pctChange: 5.3 },
    { city: "Hayward", coordinates: [-122.0808, 37.6688], perDoor: 172000, pctChange: 8.7 },
    { city: "Fremont", coordinates: [-121.9886, 37.5485], perDoor: 226000, pctChange: 1.8 },
    { city: "Walnut Creek", coordinates: [-122.0652, 37.9101], perDoor: 209000, pctChange: 2.6 },
    { city: "Concord", coordinates: [-122.032, 37.9779], perDoor: 163000, pctChange: 7.2 },
    { city: "Pleasanton", coordinates: [-121.8747, 37.6624], perDoor: 194000, pctChange: 5.6 },
    // South Bay / Silicon Valley
    { city: "Mountain View", coordinates: [-122.084, 37.3861], perDoor: 271000, pctChange: -1.1 },
    { city: "Sunnyvale", coordinates: [-122.0363, 37.3688], perDoor: 285000, pctChange: 2.1 },
    { city: "Santa Clara", coordinates: [-121.9552, 37.3541], perDoor: 252000, pctChange: 2.9 },
    { city: "San Jose", coordinates: [-121.8863, 37.3382], perDoor: 241000, pctChange: 3.4 },
    { city: "Milpitas", coordinates: [-121.8996, 37.4323], perDoor: 219000, pctChange: 4.1 },
];

// Diverging scale keyed on pct_change. On this landing page the only accent is
// brand navy, so "rising" reads in navy (dark = strong) and "falling" in a
// muted brick red — keeping the intuitive red-is-down cue without the loud
// #dc2626/#16a34a that clashed with the rest of the page.
function trendColor(pct: number): string {
    if (pct <= -5) return "#a04a42"; // strong falling — muted brick
    if (pct < 0) return "#cf8b86"; // mild falling — dusty rose
    if (pct === 0) return "#9ca3af"; // flat — gray
    if (pct < 5) return "#6485c4"; // mild rising — soft navy
    return "#1e3a8a"; // strong rising — brand navy (blue-900)
}

function formatPerDoor(value: number): string {
    return `$${Math.round(value / 1000)}k`;
}

function popupHtml(point: MarketPoint): string {
    const color = trendColor(point.pctChange);
    const rising = point.pctChange > 0;
    const flat = point.pctChange === 0;
    const sign = rising ? "+" : "";
    const arrowPath = flat
        ? `<rect x="1" y="3.4" width="8" height="1.2" rx="0.6" />`
        : rising
          ? `<path d="M5 1l3.5 4.6H1.5z" />`
          : `<path d="M5 7L1.5 2.4h7z" />`;
    const arrow = `<svg class="mmt-arrow" viewBox="0 0 10 8" width="9" height="8" fill="currentColor" aria-hidden="true">${arrowPath}</svg>`;
    return `<div class="mmt-inner">
        <div class="mmt-city">${point.city}</div>
        <div class="mmt-metric">${formatPerDoor(point.perDoor)}<span class="mmt-unit">/door</span></div>
        <div class="mmt-change" style="color:${color};background:color-mix(in srgb, ${color} 12%, transparent)">
            ${arrow}${sign}${point.pctChange.toFixed(1)}%<span class="mmt-yoy">YoY</span>
        </div>
    </div>`;
}

// GeoJSON is the source of truth for the native circle + label layers. Every
// feature carries a numeric `id` so feature-state (`highlight`) can grow and
// brighten the active dot, plus a precomputed color and label so the paint
// expressions stay declarative.
const MARKET_GEOJSON: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: MARKET_POINTS.map((point, index) => ({
        type: "Feature",
        id: index,
        geometry: { type: "Point", coordinates: point.coordinates },
        properties: {
            index,
            color: trendColor(point.pctChange),
            // Magnitude of the YoY swing drives dot size so the biggest movers
            // read largest.
            mag: Math.abs(point.pctChange),
        },
    })),
};

const DOTS_LAYER = "market-dots";
const SOURCE_ID = "markets";
const ROTATION_INTERVAL_MS = 3200;
// Duration of the opening fitBounds camera fly-in. Exported so the hero
// underline draw ("mid-market") can match it, and broadcast on the event below
// so both animations start on the same frame.
export const MAP_ZOOM_DURATION_MS = 1600;
// Fired the moment the opening zoom starts, so the hero underline can sync to it.
export const MAP_ZOOM_EVENT = "welcome-map-zoom";

export function MarketMap() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const isDarkRef = useRef(false);
    const style = useMapboxStyle("welcome");
    // Tracks the style already applied to the map so the effect below can skip
    // the redundant initial setStyle (which would needlessly tear down and
    // reload the just-built style, racing the rotation timer).
    const appliedStyleRef = useRef(style);

    // Keep the current theme in a ref so the style-load handler (which re-adds
    // the data layers after every basemap swap) can pick theme-aware
    // stroke/label colors without re-subscribing.
    isDarkRef.current = style !== getMapboxStyle(false, "welcome");

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        const container = containerRef.current;
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const map = new mapboxgl.Map({
            container,
            style,
            center: [-122.13, 37.72],
            // Start zoomed out — fitBounds below animates the camera in on load
            // for a cinematic "zooming into the Bay Area" opening.
            zoom: 6.6,
            attributionControl: false,
            // A landing-page display, not a tool: no scroll hijack, no zoom UI.
            scrollZoom: false,
            cooperativeGestures: true,
        });
        mapRef.current = map;

        map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");

        const bounds = new mapboxgl.LngLatBounds();
        MARKET_POINTS.forEach((point) => bounds.extend(point.coordinates));

        // One reusable callout, shared by hover and the auto-rotating spotlight.
        const popup = new mapboxgl.Popup({ offset: 12, closeButton: false, closeOnClick: false }).addClassName("market-map-popup");

        let activeIndex: number | null = null;

        // Guard feature-state writes: setStyle briefly tears down the source
        // before `style.load` re-adds it, and the rotation timer can fire in
        // that gap. setFeatureState *fires* an error event (it doesn't throw),
        // so it can't be caught — gate on isStyleLoaded()/getSource instead.
        function setHighlight(index: number, on: boolean) {
            if (!map.isStyleLoaded() || !map.getSource(SOURCE_ID)) return;
            map.setFeatureState({ source: SOURCE_ID, id: index }, { highlight: on });
        }

        function setActive(point: MarketPoint, index: number) {
            if (activeIndex !== null && activeIndex !== index) setHighlight(activeIndex, false);
            activeIndex = index;
            setHighlight(index, true);
            popup.setLngLat(point.coordinates).setHTML(popupHtml(point)).addTo(map);
        }

        function clearActive() {
            if (activeIndex !== null) setHighlight(activeIndex, false);
            activeIndex = null;
            popup.remove();
        }

        // --- Auto-rotating spotlight -------------------------------------
        // Cycles the callout through cities so the data feels alive without a
        // hover. Pauses while the visitor is interacting, and is skipped
        // entirely for prefers-reduced-motion.
        let rotationTimer: ReturnType<typeof setInterval> | null = null;
        let rotationStartTimer: ReturnType<typeof setTimeout> | null = null;
        let rotationIndex = 0;
        let rotationPaused = false;

        function advanceRotation() {
            if (rotationPaused) return;
            const index = rotationIndex % MARKET_POINTS.length;
            setActive(MARKET_POINTS[index], index);
            rotationIndex = (rotationIndex + 1) % MARKET_POINTS.length;
        }

        function pauseRotation() {
            rotationPaused = true;
        }

        function resumeRotation() {
            rotationPaused = false;
        }

        container.addEventListener("mouseenter", pauseRotation);
        container.addEventListener("mouseleave", resumeRotation);

        // --- Hover to inspect --------------------------------------------
        map.on("mousemove", DOTS_LAYER, (event) => {
            const feature = event.features?.[0];
            if (feature?.id === undefined || feature.id === null) return;
            const index = Number(feature.id);
            rotationPaused = true;
            map.getCanvas().style.cursor = "pointer";
            setActive(MARKET_POINTS[index], index);
        });
        map.on("mouseleave", DOTS_LAYER, () => {
            map.getCanvas().style.cursor = "";
            clearActive();
            // Resume unless the pointer left the map entirely (container
            // mouseleave already flipped this) — either way rotation restarts.
            rotationPaused = false;
        });

        // Re-add the data layers after every style load (initial paint and each
        // theme swap wipe non-basemap layers) and quiet the basemap so the data
        // is the only thing shouting.
        function handleStyleLoad() {
            activeIndex = null; // feature-state is cleared with the old style
            addDataLayers(map, isDarkRef.current);
            quietBasemap(map);
        }
        map.on("style.load", handleStyleLoad);

        map.once("load", () => {
            // Mapbox automatically skips this animation for
            // prefers-reduced-motion users (no `essential: true`).
            map.fitBounds(bounds, { padding: { top: 56, right: 56, bottom: 40, left: 56 }, maxZoom: 9.5, duration: MAP_ZOOM_DURATION_MS });

            // Kick off the hero "mid-market" underline draw on the same frame the
            // camera starts flying in, so the two animations read as one gesture.
            window.dispatchEvent(new CustomEvent(MAP_ZOOM_EVENT, { detail: { duration: MAP_ZOOM_DURATION_MS } }));

            if (!prefersReducedMotion) {
                rotationStartTimer = setTimeout(() => {
                    advanceRotation();
                    rotationTimer = setInterval(advanceRotation, ROTATION_INTERVAL_MS);
                }, 2200);
            }
        });

        return () => {
            if (rotationStartTimer) clearTimeout(rotationStartTimer);
            if (rotationTimer) clearInterval(rotationTimer);
            container.removeEventListener("mouseenter", pauseRotation);
            container.removeEventListener("mouseleave", resumeRotation);
            map.remove();
            mapRef.current = null;
        };
        // Initialize once; theme changes are handled by the style effect below.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Swap the basemap when the resolved style changes — both on the initial
    // light→dark correction (useMapboxStyle returns light until mounted) and on
    // later theme toggles. The `style.load` handler re-adds the data layers.
    useEffect(() => {
        const map = mapRef.current;
        if (!map || appliedStyleRef.current === style) return;
        appliedStyleRef.current = style;
        map.setStyle(style);
    }, [style]);

    return (
        <div
            ref={containerRef}
            className="h-full min-h-[280px] w-full"
            aria-label="Sample mid-market multifamily sales-trend map of the San Francisco Bay Area"
        />
    );
}

// Add the circle layer. Dots only — the $/door and YoY numbers live in the
// hover / auto-rotating callout, keeping the map clean and gallery-like.
// `dark` picks a theme-aware stroke color so dots stay crisply separated from
// the basemap in both themes.
function addDataLayers(map: mapboxgl.Map, dark: boolean) {
    if (map.getLayer(DOTS_LAYER)) map.removeLayer(DOTS_LAYER);
    if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);

    map.addSource(SOURCE_ID, { type: "geojson", data: MARKET_GEOJSON });

    const highlighted = ["boolean", ["feature-state", "highlight"], false];

    map.addLayer({
        id: DOTS_LAYER,
        type: "circle",
        source: SOURCE_ID,
        paint: {
            "circle-color": ["get", "color"],
            // Radius grows gently with the size of the YoY swing; the active dot
            // gets a few extra pixels so the spotlight reads. No zoom term —
            // Mapbox forbids mixing a zoom expression with feature-state, and
            // this map is effectively fixed-zoom anyway.
            "circle-radius": ["+", 4.5, ["*", 0.35, ["get", "mag"]], ["case", highlighted, 3, 0]],
            "circle-opacity": ["case", highlighted, 1, 0.88],
            "circle-stroke-width": ["case", highlighted, 2.5, 1.4],
            "circle-stroke-color": dark ? "#0b1220" : "#ffffff",
        },
    });
}

// Hide the busy default labels (POIs, roads, transit) so the sales-trend data
// is the only thing competing for attention. No-ops on the custom dark style,
// whose layer ids don't match — that style is already tuned in Studio.
function quietBasemap(map: mapboxgl.Map) {
    const layers = map.getStyle()?.layers;
    if (!layers) return;
    for (const layer of layers) {
        if (layer.type !== "symbol") continue;
        if (/poi|road|transit|airport|ferry|natural-point/i.test(layer.id)) {
            try {
                map.setLayoutProperty(layer.id, "visibility", "none");
            } catch {
                // Layer may not accept the property on some styles; ignore.
            }
        }
    }
}
