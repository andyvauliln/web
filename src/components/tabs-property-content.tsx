'use client'
import ContentTypeSwittcher from "~/components/view-type-swittcher"
import { CardHeader, CardContent, CardFooter, Card } from "~/components/ui/card"
import LandDetails from "~/components/land-details";
import { Button } from "~/components/ui/button"
import LandMap from "./land-map"
import DeckMap from "./deck-map"
import LandList from "./land-list"
import { atomWithStorage } from 'jotai/utils'
import { useAtom } from 'jotai'
import React, { useState } from "react";
import type { FeatureCollection, Feature } from 'geojson';
import type { Land } from '~/server/lands';
import { CustomProfiler } from '~/components/profiler'
import LandFilters from "./land-filter";
import { ContentFilter } from "./content-filter";
import { PropertyTypeFilter } from "./property-type-filter";

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
                <CardHeader className="flex justify-between">
                    {/* <LandFilters /> */}
                    <SubHeader />
                    <div>Controls</div>
                </CardHeader>
                <CardContent className="flex-grow relative">
                    {/* {value === 'Map' ? <DeckMap /> : <LandList />} */}
                    {value === 'Map' ? <LandMap mapData={landData} onClick={onLandClick} /> : <LandList />}
                    <AddSvgIcon />
                    <ContentTypeSwittcher value={value} onChange={(): void => {
                        setValue(value === 'Map' ? 'List' : 'Map');
                    }} />
                    <ChatSvgIcon />
                    <SettingsSvgIcon />
                </CardContent>

                <CardFooter className="flex justify-between">
                    <PropertyTypeFilter />
                    <ContentFilter />
                </CardFooter>
                <LandDetails isOpen={isOpen} setIsOpen={setIsOpen} currentLand={currentLand} />

            </Card>
        </CustomProfiler>
    )
}

function AddSvgIcon() {
    return <svg className="w-10 h-10 text-white dark:text-gray-800 absolute top-2 right-2 cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z" clipRule="evenodd" />
    </svg>

}
function ChatSvgIcon() {
    return <svg className="w-10 h-10 absolute top-14 right-2 cursor-pointer text-white dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17h6l3 3v-3h2V9h-2M4 4h11v8H9l-3 3v-3H4V4Z" />
    </svg>

}
function SettingsSvgIcon() {
    return <svg className="w-10 h-10 absolute top-28 right-2 cursor-pointer text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 4v10m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v2m6-16v2m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v10m6-16v10m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v2" />
    </svg>
}

function SubHeader() {
    return (
        <form className="flex w-full max-w-[50%]">
            <label htmlFor="voice-search" className="sr-only">Search</label>
            <div className="relative w-full">
                <input type="text" id="voice-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Mockups, Logos, Design Templates..." required />
                <button type="button" className="absolute inset-y-0 end-0 flex items-center pe-3">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7v3a5.006 5.006 0 0 1-5 5H6a5.006 5.006 0 0 1-5-5V7m7 9v3m-3 0h6M7 1h2a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3Z" />
                    </svg>
                </button>
            </div>
            <button type="button" className="px-3 py-2 w-full text-xs font-medium text-center inline-flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                <svg className="w-3 h-3 text-white me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                    <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                    <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                </svg>
                Extra small
            </button>
        </form>
    )

}
// Map/List
// Saved Lands
// Mine Lads
// Show Sold Lands
// Rent/Buy/All
// From Agents/Owners
// With Due Deligence
// With Videos
// With Photos

// Construction Services
// Info
// Zones


