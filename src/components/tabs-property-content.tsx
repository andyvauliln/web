'use client'
import ContentTypeSwittcher from "~/components/view-type-swittcher"
import { CardHeader, CardContent, CardFooter, Card } from "~/components/ui/card"
import DetailsSidebar, { detailsSidebarAtom } from "~/components/details-sidebar";
import LandMap from "./land-map"
import DeckMap from "../../archive/deck-map"
import LandList from "./land-list"
import { atomWithStorage } from 'jotai/utils'
import { useAtom } from 'jotai'
import React, { useState } from "react";
import type { FeatureCollection, Feature } from 'geojson';
import type { Land } from '~/server/lands';
import { CustomProfiler } from '~/components/profiler'
import { PropertyTypeFilter } from "./property-type-filter";
import SubHeader from "./sub-header";
import { createPortal } from "react-dom";
import { Suspense } from "react";

type ContentType = 'Map' | 'List';
const contentTypeAtom = atomWithStorage<ContentType>('land_content_type', "Map")


export default function TabsLandContent() {
    const [value, setValue] = useAtom(contentTypeAtom)
    const [detailsSidebarData, setDetailsSidebarData] = useAtom(detailsSidebarAtom)
    const [landData, setLandData] = React.useState<FeatureCollection | null>(null);

    React.useEffect(() => {
        async function fetchLandData() {
            try {
                const response = await fetch('/api/lands');
                const data: Land[] = await response.json();
                const features: Feature[] = data.map((land, index) => ({
                    type: 'Feature',
                    id: index + 1,
                    properties: land.properties,
                    geometry: {
                        type: 'MultiPolygon',
                        coordinates: land.polygon
                    }
                }));
                setLandData({
                    type: 'FeatureCollection',
                    features: features
                });
            } catch (error) {
                console.error('Error fetching land data:', error);
            }
        }

        fetchLandData();
    }, []);

    const onLandClick = (feature: Feature | null) => {
        setDetailsSidebarData({
            data: feature,
            isOpen: true,
            content: 'land-details',
            side: 'right'
        })
    }
    const onLandFilterClick = () => {
        setDetailsSidebarData({
            data: null,
            isOpen: true,
            content: 'land-filter',
            side: 'right'
        })
    }
    const onMapSettingsClick = () => {
        setDetailsSidebarData({
            data: null,
            isOpen: true,
            content: 'map-settings',
            side: 'left'
        })
    }

    return (
        <CustomProfiler id="CardTabComponent">
            <Card className="h-full w-full flex flex-col">
                <CardHeader className="flex justify-between items-center p-2">
                    <SubHeader />
                    <AddButton />

                </CardHeader>
                <CardContent className="flex-grow relative h-[calc(100%-4rem)]">
                    <Suspense fallback={<div>Loading...</div>}>
                        {value === 'Map' ? <LandMap mapData={landData} onClick={onLandClick} /> : <LandList />}
                    </Suspense>
                    <MapSettingsButton onClick={onMapSettingsClick} />
                    <LandFilters onClick={onLandFilterClick} />
                    <ContentTypeSwittcher value={value} onChange={(): void => {
                        setValue(value === 'Map' ? 'List' : 'Map');
                    }} />
                </CardContent>
                <PropertyControls />
                <DetailsSidebar />
            </Card>
        </CustomProfiler>
    )
}

function PropertyControls() {
    const [footerElement, setFooterElement] = useState<HTMLElement | null>(null);

    React.useEffect(() => {
        // This code runs only in the client-side environment
        const currentFooterElement = document.getElementById('footer-content');
        setFooterElement(currentFooterElement);
    }, []);

    if (!footerElement) return null;

    return createPortal(
        <PropertyTypeFilter />,
        footerElement
    );
}

function AddButton() {
    return <svg className="w-8 h-8 text-green-700 cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z" clipRule="evenodd" />
    </svg>

}

function MapSettingsButton({ onClick }: { onClick: () => void }) {
    return <svg onClick={onClick} className="w-10 h-10 absolute top-2 right-2 cursor-pointer text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M20 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6h-2m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4" />
    </svg>
    //     <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
    //     <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M20 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6h-2m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4"/>
    //   </svg>

}
function LandFilters({ onClick }: { onClick: () => void }) {
    return <svg onClick={onClick} className="w-10 h-10 absolute top-16 right-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M18.796 4H5.204a1 1 0 0 0-.753 1.659l5.302 6.058a1 1 0 0 1 .247.659v4.874a.5.5 0 0 0 .2.4l3 2.25a.5.5 0 0 0 .8-.4v-7.124a1 1 0 0 1 .247-.659l5.302-6.059c.566-.646.106-1.658-.753-1.658Z" />
    </svg>

}


