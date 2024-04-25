'use client'
import ContentTypeSwittcher from "~/components/view-type-swittcher"
import { CardHeader, CardContent, CardFooter, Card } from "~/components/ui/card"
import LandDetails from "~/components/land-details";
import LandMap from "./land-map"
import DeckMap from "./deck-map"
import LandList from "./land-list"
import { atomWithStorage } from 'jotai/utils'
import { useAtom } from 'jotai'
import React, { useState } from "react";
import type { FeatureCollection, Feature } from 'geojson';
import type { Land } from '~/server/lands';
import { CustomProfiler } from '~/components/profiler'
import { PropertyTypeFilter } from "./property-type-filter";
import SubHeader from "./sub-header";

type ContentType = 'Map' | 'List';
const contentTypeAtom = atomWithStorage<ContentType>('land_content_type', "Map")
const currentLandAtom = atomWithStorage<Feature | null>('currentLand', null)

export default function TabsLandContent() {
    const [value, setValue] = useAtom(contentTypeAtom)
    const [isOpen, setIsOpen] = useState(false);
    const [currentLand, setCurrentLand] = useState<Feature | null | undefined>(null);
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
        setCurrentLand(feature)
        setIsOpen(true)
    }

    return (
        <CustomProfiler id="CardTabComponent">
            <Card className="h-full w-full flex flex-col">
                <CardHeader className="flex justify-between items-center p-2">
                    <SubHeader />
                    <AddButton />

                </CardHeader>
                <CardContent className="flex-grow relative">
                    {value === 'Map' ? <LandMap mapData={landData} onClick={onLandClick} /> : <LandList />}

                    <MapSettingsButton />
                    <LandFilters />
                    <ContentTypeSwittcher value={value} onChange={(): void => {
                        setValue(value === 'Map' ? 'List' : 'Map');
                    }} />
                </CardContent>

                <CardFooter className="flex justify-between">
                    <PropertyTypeFilter />
                </CardFooter>
                <RightSidebar isOpen={isOpen} setIsOpen={setIsOpen} currentLand={currentLand} />
                <LeftSidebar isOpen={isOpen} setIsOpen={setIsOpen} currentLand={currentLand} />

            </Card>
        </CustomProfiler>
    )
}

function AddButton() {
    return <svg className="w-8 h-8 text-green-700 cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z" clipRule="evenodd" />
    </svg>

}

function MapSettingsButton() {
    return <svg className="w-10 h-10 absolute top-2 right-2 cursor-pointer text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M6 4v10m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v2m6-16v2m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v10m6-16v10m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v2" />
    </svg>
}
function LandFilters() {
    return <svg className="w-10 h-10 absolute top-16 right-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M18.796 4H5.204a1 1 0 0 0-.753 1.659l5.302 6.058a1 1 0 0 1 .247.659v4.874a.5.5 0 0 0 .2.4l3 2.25a.5.5 0 0 0 .8-.4v-7.124a1 1 0 0 1 .247-.659l5.302-6.059c.566-.646.106-1.658-.753-1.658Z" />
    </svg>

}


