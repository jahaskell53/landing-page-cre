"use client";

import { Filter, MapPin } from "lucide-react";
import { PropertiesSidebar } from "@/app/(app)/analytics/map/properties-sidebar";
import { type Property, PropertyMap } from "@/components/application/map/property-map";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MOCK_LISTINGS: Property[] = [
    {
        id: "preview-1",
        name: "421 University Ave",
        address: "Palo Alto, CA",
        units: 32,
        price: "$5.8M",
        coordinates: [-122.161, 37.445],
        capRate: "5.0% cap",
        listingSource: "loopnet",
    },
    {
        id: "preview-2",
        name: "855 Alma St",
        address: "Palo Alto, CA",
        units: 24,
        price: "$3.6M",
        coordinates: [-122.158, 37.439],
        capRate: "5.6% cap",
        listingSource: "loopnet",
    },
    {
        id: "preview-3",
        name: "525 Bryant St",
        address: "Palo Alto, CA",
        units: 18,
        price: "$2.9M",
        coordinates: [-122.162, 37.448],
        capRate: "5.2% cap",
        listingSource: "loopnet",
    },
    {
        id: "preview-4",
        name: "195 Page Mill Rd",
        address: "Palo Alto, CA",
        units: 16,
        price: "$3.2M",
        coordinates: [-122.148, 37.428],
        capRate: "4.9% cap",
        listingSource: "loopnet",
    },
    {
        id: "preview-5",
        name: "2500 El Camino Real",
        address: "Palo Alto, CA",
        units: 22,
        price: "$4.1M",
        coordinates: [-122.128, 37.435],
        capRate: "5.3% cap",
        listingSource: "loopnet",
    },
];

const PREVIEW_CENTER: [number, number] = [-122.143, 37.4419];
const PREVIEW_ZOOM = 11.5;

export function ListingsMapPreview() {
    return (
        <div aria-hidden className="pointer-events-none -m-6 flex min-h-[480px] flex-col select-none">
            <div className="flex flex-shrink-0 flex-col gap-3 border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex w-full max-w-lg min-w-0 rounded-lg border border-input shadow-xs">
                    <div className="flex h-10 w-[min(38%,7rem)] shrink-0 items-center rounded-l-lg border-r bg-muted/30 px-3 text-sm text-gray-700 dark:text-gray-300">
                        City
                    </div>
                    <div className="flex min-h-10 min-w-0 flex-1 items-center gap-1.5 border-l border-input bg-blue-50/80 px-3 py-2 text-sm text-blue-800 dark:bg-blue-950/40 dark:text-blue-200">
                        <MapPin className="size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                        <span className="min-w-0 flex-1 truncate">Palo Alto, CA</span>
                    </div>
                </div>
            </div>

            <div className="relative flex min-h-0 flex-1 overflow-hidden">
                <PropertiesSidebar
                    properties={MOCK_LISTINGS}
                    selectedId="preview-1"
                    loading={false}
                    totalCount={42}
                    onSelect={() => {}}
                    className="hidden w-44 shrink-0 sm:flex lg:w-48"
                />

                <div className="relative min-h-0 min-w-0 flex-1">
                    <PropertyMap
                        properties={MOCK_LISTINGS}
                        selectedId="preview-1"
                        className="absolute inset-0"
                        initialCenter={PREVIEW_CENTER}
                        initialZoom={PREVIEW_ZOOM}
                    />
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                        <Button type="button" variant="outline" size="icon" className="relative bg-background/95 shadow-sm backdrop-blur-sm" tabIndex={-1}>
                            <Filter className="size-4" />
                        </Button>
                        <div className="flex rounded-lg bg-muted p-0.5 shadow-sm">
                            {(["zillow", "loopnet"] as const).map((source) => (
                                <span
                                    key={source}
                                    className={cn(
                                        "rounded-md px-2.5 py-1.5 text-xs font-medium",
                                        source === "loopnet" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground",
                                    )}
                                >
                                    {source === "loopnet" ? "Sales" : "Rent"}
                                </span>
                            ))}
                        </div>
                        <div className="flex rounded-lg bg-muted p-0.5 shadow-sm">
                            {(["Latest", "Historical"] as const).map((label, i) => (
                                <span
                                    key={label}
                                    className={cn(
                                        "rounded-md px-2.5 py-1.5 text-xs font-medium",
                                        i === 0 ? "bg-background text-foreground shadow-sm" : "text-muted-foreground",
                                    )}
                                >
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
