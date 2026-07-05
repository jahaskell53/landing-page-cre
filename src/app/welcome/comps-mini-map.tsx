"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useMapboxStyle } from "@/hooks/use-mapbox-style";
import { getMapboxStyle } from "@/lib/mapbox-style";
import { MAPBOX_TOKEN } from "@/lib/mapbox-token";

mapboxgl.accessToken = MAPBOX_TOKEN;

const RADIUS_SOURCE = "comps-radius";
const RADIUS_FILL = "comps-radius-fill";
const RADIUS_LINE = "comps-radius-line";
const POINTS_SOURCE = "comps-points";
const COMP_LAYER = "comps-comp-points";
const SUBJECT_LAYER = "comps-subject-point";

function circlePolygon(center: [number, number], radiusMiles: number, steps = 64): GeoJSON.Feature<GeoJSON.Polygon> {
    const [lng, lat] = center;
    const km = radiusMiles * 1.60934;
    const latRad = (lat * Math.PI) / 180;
    const dx = km / (111.32 * Math.cos(latRad));
    const dy = km / 110.574;
    const ring: [number, number][] = [];

    for (let i = 0; i < steps; i++) {
        const theta = (i / steps) * 2 * Math.PI;
        ring.push([lng + dx * Math.cos(theta), lat + dy * Math.sin(theta)]);
    }
    ring.push(ring[0]);

    return {
        type: "Feature",
        geometry: { type: "Polygon", coordinates: [ring] },
        properties: {},
    };
}

function pointsGeoJSON(subject: [number, number], comps: [number, number][]): GeoJSON.FeatureCollection {
    return {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                geometry: { type: "Point", coordinates: subject },
                properties: { kind: "subject" },
            },
            ...comps.map((coordinates) => ({
                type: "Feature",
                geometry: { type: "Point", coordinates },
                properties: { kind: "comp" },
            })),
        ],
    };
}

function addLayers(map: mapboxgl.Map, subject: [number, number], comps: [number, number][], radiusMiles: number, dark: boolean) {
    const radius = circlePolygon(subject, radiusMiles);

    if (map.getLayer(SUBJECT_LAYER)) map.removeLayer(SUBJECT_LAYER);
    if (map.getLayer(COMP_LAYER)) map.removeLayer(COMP_LAYER);
    if (map.getLayer(RADIUS_LINE)) map.removeLayer(RADIUS_LINE);
    if (map.getLayer(RADIUS_FILL)) map.removeLayer(RADIUS_FILL);
    if (map.getSource(POINTS_SOURCE)) map.removeSource(POINTS_SOURCE);
    if (map.getSource(RADIUS_SOURCE)) map.removeSource(RADIUS_SOURCE);

    map.addSource(RADIUS_SOURCE, { type: "geojson", data: radius });
    map.addLayer({
        id: RADIUS_FILL,
        type: "fill",
        source: RADIUS_SOURCE,
        paint: { "fill-color": "#60a5fa", "fill-opacity": 0.12 },
    });
    map.addLayer({
        id: RADIUS_LINE,
        type: "line",
        source: RADIUS_SOURCE,
        paint: { "line-color": "#60a5fa", "line-width": 1.5, "line-opacity": 0.7 },
    });

    map.addSource(POINTS_SOURCE, { type: "geojson", data: pointsGeoJSON(subject, comps) });
    map.addLayer({
        id: COMP_LAYER,
        type: "circle",
        source: POINTS_SOURCE,
        filter: ["==", ["get", "kind"], "comp"],
        paint: {
            "circle-color": "#2563eb",
            "circle-radius": 4,
            "circle-stroke-width": 1.5,
            "circle-stroke-color": dark ? "#0b1220" : "#ffffff",
        },
    });
    map.addLayer({
        id: SUBJECT_LAYER,
        type: "circle",
        source: POINTS_SOURCE,
        filter: ["==", ["get", "kind"], "subject"],
        paint: {
            "circle-color": "#f97316",
            "circle-radius": 5,
            "circle-stroke-width": 2,
            "circle-stroke-color": dark ? "#0b1220" : "#ffffff",
        },
    });
}

function fitToData(map: mapboxgl.Map, subject: [number, number], comps: [number, number][], radiusMiles: number) {
    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend(subject);
    comps.forEach((coord) => bounds.extend(coord));
    circlePolygon(subject, radiusMiles, 16).geometry.coordinates[0].forEach((coord) => bounds.extend(coord));
    map.fitBounds(bounds, { padding: 16, duration: 0, maxZoom: 14 });
}

export function CompsMiniMap({
    subject,
    comps,
    radiusMiles = 2,
}: {
    subject: [number, number];
    comps: [number, number][];
    radiusMiles?: number;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const style = useMapboxStyle("standard");
    const isDark = style !== getMapboxStyle(false, "standard");

    useEffect(() => {
        if (!containerRef.current || !MAPBOX_TOKEN) return;

        mapRef.current?.remove();
        mapRef.current = null;

        const map = new mapboxgl.Map({
            container: containerRef.current,
            style,
            center: subject,
            zoom: 12,
            attributionControl: false,
            scrollZoom: false,
            boxZoom: false,
            dragRotate: false,
            dragPan: false,
            keyboard: false,
            doubleClickZoom: false,
            touchZoomRotate: false,
        });
        mapRef.current = map;

        map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");

        map.on("load", () => {
            addLayers(map, subject, comps, radiusMiles, isDark);
            fitToData(map, subject, comps, radiusMiles);
        });

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, [subject, comps, radiusMiles, style, isDark]);

    return (
        <div className="relative h-[120px] overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <div ref={containerRef} className="h-full w-full" />
        </div>
    );
}
