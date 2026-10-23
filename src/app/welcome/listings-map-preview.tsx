"use client";

import { Filter, MapPin, X } from "lucide-react";
import { PropertiesSidebar } from "@/app/(app)/analytics/map/properties-sidebar";
import { type Property, PropertyMap } from "@/components/application/map/property-map";
import { SegmentedControl } from "@/components/analytics/filters/segmented-control";
import { Button } from "@/components/ui/button";
import { usePreviewSelection } from "./preview-interaction";

const PHOTO_UNIVERSITY = "/mockups/listings/listing-1.webp";
const PHOTO_ALMA = "/mockups/listings/listing-2.webp";
const PHOTO_BRYANT = "/mockups/listings/listing-3.webp";
const PHOTO_PAGE_MILL = "/mockups/listings/listing-4.webp";
const PHOTO_EL_CAMINO = "/mockups/listings/listing-5.webp";

const SALES_LISTINGS: Property[] = [
    {
        id: "preview-1",
        name: "421 University Ave",
        address: "Palo Alto, CA",
        units: 32,
        price: "$5.8M",
        coordinates: [-122.161, 37.445],
        capRate: "5.0% cap",
        listingSource: "loopnet",
        thumbnailUrl: PHOTO_UNIVERSITY,
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
        thumbnailUrl: PHOTO_ALMA,
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
        thumbnailUrl: PHOTO_BRYANT,
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
        thumbnailUrl: PHOTO_PAGE_MILL,
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
        thumbnailUrl: PHOTO_EL_CAMINO,
    },
];

const RENT_LISTINGS: Property[] = [
    {
        id: "rent-1",
        name: "421 University Ave",
        address: "Palo Alto, CA",
        units: 32,
        price: "$3,450/mo",
        coordinates: [-122.161, 37.445],
        listingSource: "zillow",
        thumbnailUrl: PHOTO_UNIVERSITY,
    },
    {
        id: "rent-2",
        name: "855 Alma St",
        address: "Palo Alto, CA",
        units: 24,
        price: "$2,980/mo",
        coordinates: [-122.158, 37.439],
        listingSource: "zillow",
        thumbnailUrl: PHOTO_ALMA,
    },
    {
        id: "rent-3",
        name: "525 Bryant St",
        address: "Palo Alto, CA",
        units: 18,
        price: "$2,650/mo",
        coordinates: [-122.162, 37.448],
        listingSource: "zillow",
        thumbnailUrl: PHOTO_BRYANT,
    },
];

const PREVIEW_CENTER: [number, number] = [-122.143, 37.4419];
const PREVIEW_ZOOM = 11.5;

export function ListingsMapPreview() {
    const [source, setSource] = usePreviewSelection<"loopnet" | "zillow">("loopnet");
    const [vintage, setVintage] = usePreviewSelection<"Latest" | "Historical">("Latest");
    const [selectedSalesId, setSelectedSalesId] = usePreviewSelection<string>("preview-1");
    const [selectedRentId, setSelectedRentId] = usePreviewSelection<string>("rent-1");

    const isSales = source === "loopnet";
    const properties = isSales ? SALES_LISTINGS : RENT_LISTINGS;
    const selectedId = isSales ? selectedSalesId : selectedRentId;
    const onSelect = isSales ? setSelectedSalesId : setSelectedRentId;

    return (
        <div className="-m-6 flex min-h-[480px] flex-col">
            <div className="flex flex-shrink-0 flex-col gap-3 border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex w-full max-w-lg min-w-0 rounded-lg border border-input shadow-xs">
                    <div className="flex h-10 w-[min(38%,7rem)] shrink-0 items-center rounded-l-lg border-r bg-muted/30 px-3 text-sm text-gray-700 dark:text-gray-300">
                        City
                    </div>
                    <div className="flex min-h-10 min-w-0 flex-1 items-center gap-1.5 border-l border-input bg-transparent px-3 py-2 text-sm text-foreground">
                        <MapPin className="size-4 shrink-0 text-gray-400" />
                        <span className="min-w-0 flex-1 truncate">Palo Alto, CA</span>
                        <button type="button" className="shrink-0 text-muted-foreground hover:text-foreground" aria-label="Clear area">
                            <X className="size-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="relative flex min-h-0 flex-1 overflow-hidden">
                <PropertiesSidebar
                    properties={properties}
                    selectedId={selectedId}
                    loading={false}
                    totalCount={isSales ? 42 : 18}
                    onSelect={(id) => onSelect(String(id))}
                    disableLinks
                    className="hidden w-44 shrink-0 sm:flex lg:w-48"
                />

                <div className="relative min-h-0 min-w-0 flex-1">
                    <PropertyMap
                        properties={properties}
                        selectedId={selectedId}
                        className="absolute inset-0"
                        initialCenter={PREVIEW_CENTER}
                        initialZoom={PREVIEW_ZOOM}
                        disableLinks
                    />
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                        <Button type="button" variant="outline" size="icon" className="relative bg-background/95 shadow-sm backdrop-blur-sm">
                            <Filter className="size-4" />
                        </Button>
                        <SegmentedControl
                            size="sm"
                            ariaLabel="Listing type"
                            options={[
                                { value: "zillow", label: "Rent" },
                                { value: "loopnet", label: "Sales" },
                            ]}
                            value={source}
                            onChange={setSource}
                            className="bg-muted shadow-sm"
                        />
                        <SegmentedControl
                            size="sm"
                            ariaLabel="Listing vintage"
                            options={[
                                { value: "Latest", label: "Latest" },
                                { value: "Historical", label: "Historical" },
                            ]}
                            value={vintage}
                            onChange={setVintage}
                            className="bg-muted shadow-sm"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
