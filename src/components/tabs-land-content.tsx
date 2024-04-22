'use client'
import ContentTypeSwittcher from "~/components/content-type-swittcher"
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
import LandOfferTypes from "./land-filter";
import { ContentFilter } from "./content-filter";

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
                <CardHeader>
                    <LandOfferTypes />
                </CardHeader>
                <CardContent className="flex-grow">
                    {/* {value === 'Map' ? <DeckMap /> : <LandList />} */}
                    {value === 'Map' ? <LandMap mapData={landData} onClick={onLandClick} /> : <LandList />}
                </CardContent>
                {/* <Button variant="outline" onClick={() => setIsOpen(!isOpen)}>Open</Button> */}

                <CardFooter className="flex justify-between">
                    <div className="flex">
                        <ContentTypeSwittcher value={value} onChange={(): void => {
                            setValue(value === 'Map' ? 'List' : 'Map');
                        }} />
                        <Button variant="outline">
                            Add
                        </Button>
                    </div>
                    <ContentFilter />
                </CardFooter>
                <LandDetails isOpen={isOpen} setIsOpen={setIsOpen} currentLand={currentLand} />
            </Card>
        </CustomProfiler>
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
// Zones

