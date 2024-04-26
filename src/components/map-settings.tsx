'use client'
import React from 'react';
import { atomWithStorage } from 'jotai/utils'
import { useAtom } from 'jotai'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select"
import { SheetContent, Sheet, SheetTitle } from "~/components/ui/sheet"


const filterOptions = [
    { title: "Show Everting", value: "all", color: "white" },
    { title: "Show Buildings", value: "buildings", color: "white" },
    { title: "Show Main Roads", value: "main_roads", color: "white" },
    { title: "Show Motor Roads", value: "motor_roads", color: "white" },
    { title: "Show Waterways", value: "waterway", color: "white" },
    { title: "Show Region", value: "admin", color: "white" },
];

export type MapSettings = {
    layers: string[],
    zoom: number,
    lat: number,
    lng: number,
    bearing: number,
    pitch: number,
    maxZoom: number,
    minZoom: number,
    maxPitch: number,
    minPitch: number,
}
export const zoomAtom = atomWithStorage<number>('zoom', 15)
export const mapSettingsAtom = atomWithStorage<MapSettings>('map_settings', {
    layers: ["lands"],
    zoom: 15,
    lat: -8.244833,
    lng: 115.104819,
    bearing: 320,
    pitch: 30,
    maxZoom: 20,
    minZoom: 10,
    maxPitch: 80,
    minPitch: 20,
})


export default function MapSettings() {
    const [mapSettings, setMapSettings] = useAtom(mapSettingsAtom)
    console.log(mapSettings, "mapSettings")

    const handleChange = (newValue: string) => {
        if (newValue === "all") {
            if (mapSettings.layers.includes("all")) {
                setMapSettings({ ...mapSettings, layers: [] });
            } else {
                setMapSettings({ ...mapSettings, layers: filterOptions.map(item => item.value) });
            }
        } else {
            if (mapSettings.layers.includes(newValue)) {
                setMapSettings({ ...mapSettings, layers: mapSettings.layers.filter(item => item !== newValue) });
            } else {
                setMapSettings({ ...mapSettings, layers: [...mapSettings.layers.filter(item => item !== "all"), newValue] });
            }
        }
    };

    return (
        <>
            <SheetTitle>Map Settings</SheetTitle>
            <div className="flex flex-col py-2  w-full h-full p-2 ">
                {filterOptions.map(option => (
                    <div key={option.value} className="flex items-center me-4">
                        <input
                            checked={mapSettings.layers.includes(option.value)}
                            id={option.value}
                            type="checkbox"
                            value={option.value}
                            className="w-4 h-4 text-white bg-green-700 border-green-800 rounded"
                            onChange={() => handleChange(option.value)}
                        />
                        <label htmlFor={option.value} className="ms-2 text-sm font-medium text-gray-900">{option.title}</label>
                    </div>
                ))}
            </div>
        </>
    )
}

function LandPriceFilter() {
    return (
        <Select>
            <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
