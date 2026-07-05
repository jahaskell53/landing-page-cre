"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { type MapboxStylePreset, getMapboxStyle } from "@/lib/mapbox-style";

export function useMapboxStyle(preset: MapboxStylePreset = "standard"): string {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = mounted && resolvedTheme === "dark";
    return getMapboxStyle(isDark, preset);
}
