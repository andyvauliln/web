'use client'
import ContentTypeSwittcher from "~/components/content_type_swittcher"
import { CardHeader, CardContent, CardFooter, Card } from "~/components/ui/card"
import Details from "~/components/details";
import { Button } from "~/components/ui/button"
import LandMap from "./land-map"
import LandList from "./land-list"
import { atomWithStorage } from 'jotai/utils'
import { useAtom } from 'jotai'
import React, { useState } from "react";
import type { FeatureCollection, Feature } from 'geojson';
import type { Land } from '~/server/lands';
import { CustomProfiler } from '~/components/profiler'

type ContentType = 'Map' | 'List';
const contentTypeAtom = atomWithStorage<ContentType>('land_content_type', "Map")

export default function TabsLandContent() {
    const [value, setValue] = useAtom(contentTypeAtom)
    const [isOpen, setIsOpen] = useState(false);
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
    return (
        <CustomProfiler id="CardTabComponent">
            <Card className="h-full w-full flex flex-col">
                <CardHeader>
                    <Button>Mine Lands</Button>
                </CardHeader>
                <CardContent className="flex-grow">
                    {value === 'Map' ? <LandMap mapData={landData} onClick={() => setIsOpen(!isOpen)} /> : <LandList />}
                </CardContent>
                {/* <Button variant="outline" onClick={() => setIsOpen(!isOpen)}>Open</Button> */}

                <CardFooter>
                    <ContentTypeSwittcher value={value} onChange={(): void => {
                        setValue(value === 'Map' ? 'List' : 'Map');
                    }} />
                </CardFooter>
                <Details isOpen={isOpen} setIsOpen={setIsOpen} />
            </Card>
        </CustomProfiler>
    )
}
