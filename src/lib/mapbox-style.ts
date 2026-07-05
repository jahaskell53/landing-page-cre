export type MapboxStylePreset = "standard" | "streets" | "network" | "welcome";

const MAPBOX_STYLES = {
    light: {
        standard: "mapbox://styles/mapbox/light-v11",
        streets: "mapbox://styles/mapbox/streets-v12",
        network: "mapbox://styles/jahaskell531/cmkipuhbj006p01t03hd10bb1",
        welcome: "mapbox://styles/mapbox/light-v11",
    },
    dark: {
        standard: "mapbox://styles/mapbox/dark-v11",
        streets: "mapbox://styles/mapbox/dark-v11",
        network: "mapbox://styles/mapbox/dark-v11",
        welcome: "mapbox://styles/jahaskell531/cmquhs2t0005601sodekdexas",
    },
} as const;

export function getMapboxStyle(isDark: boolean, preset: MapboxStylePreset = "standard"): string {
    const palette = isDark ? MAPBOX_STYLES.dark : MAPBOX_STYLES.light;
    return palette[preset];
}
