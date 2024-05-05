'use client'
import React from 'react';
import { atomWithStorage } from 'jotai/utils'
import { useAtom } from 'jotai'
import { SheetTitle } from "~/components/ui/sheet"


const filterOptions = [
    { title: "Lands", value: "lands", color: "white", type: "geojson_file", feature_type: "Polygon", className: "" },
    { title: "Bali Regions", value: "bali_regions", color: "#98fb98", type: "geojson_file", feature_type: "Polygon" },
    { title: "Buildings", value: "buildings", color: "white", type: "map_layer", feature_type: "Fill Extrusion", className: "border-b border-gray-500 pb-2" },
    { title: "Main Roads", value: "main_roads", color: "#303130", type: "map_layer", feature_type: "Line", className: "" },
    { title: "Secondary Roads", value: "secondary_roads", color: "#FFD700", type: "map_layer", feature_type: "Line", className: "" },
    { title: "Motorbike Roads", value: "motorbike_roads", color: "#FF6347", type: "map_layer", feature_type: "Line", className: "" },
    { title: "Transport Lines", value: "transport_lines", color: "#32cd32", type: "geojson_file", feature_type: "Line", className: "" },
    { title: "Waterways", value: "waterway", color: "white", type: "map_layer", feature_type: "Line", className: "border-b border-gray-500 pb-2" },
    // Special Areas
    { title: "Sacred Areas", value: "spiritual", color: "#dda0dd", type: "geojson_file", feature_type: "Polygon", className: "" },
    { title: "Dangerous Areas", value: "disaster_areas", color: "#ff6347", type: "geojson_file", feature_type: "Polygon", className: "" },
    { title: "Agricultural Lands", value: "agricultural_lands", color: "#ffdead", type: "geojson_file", feature_type: "Polygon", className: "border-b border-gray-500 pb-2" },
    // Water Infrastructure
    { title: "Water Conservation Areas", value: "water_conservation", color: "#4682b4", type: "geojson_file", feature_type: "Polygon" },
    { title: "Flood Control Network", value: "flood_control_network", color: "#00ced1", type: "geojson_file", feature_type: "Line" },
    { title: "Drinking Water Lines", value: "drinking_water_lines", color: "#1e90ff", type: "geojson_file", feature_type: "Line" },
    { title: "Water Treatment Stations", value: "water_treatment", color: "white", type: "geojson_file", feature_type: "Point" },
    { title: "Water Flood Control", value: "water_flood_control", color: "#00bfff", type: "geojson_file", feature_type: "Line", className: "border-b border-gray-500 pb-2" },
    // Energy and Telecomunication
    { title: "Energy Lines", value: "energi_lines", color: "#ff4500", type: "geojson_file", feature_type: "Line", className: "" },
    { title: "Telkom Lines", value: "telkom_lines", color: "#ff8c00", type: "geojson_file", feature_type: "Line", className: "" },
    { title: "Power Substation", value: "power_substation", color: "white", type: "geojson_file", feature_type: "Point", className: "" },
    { title: "Telecommunication", value: "telecomunication", color: "white", type: "geojson_file", feature_type: "Point", className: "border-b border-gray-500 pb-2" },
    // Ports and Infrastructure
    { title: "Central Settlement", value: "central_settlement", color: "white", type: "geojson_file", feature_type: "Point", className: "" },
    { title: "Airports", value: "airoports", color: "white", type: "geojson_file", feature_type: "Point", className: "" },
    { title: "Main Port", value: "main_port", color: "white", type: "geojson_file", feature_type: "Point", className: "" },
    { title: "Passenger Port", value: "passenger_port", color: "white", type: "geojson_file", feature_type: "Point", className: "" },
    { title: "Ferry Port", value: "ferry_port", color: "white", type: "geojson_file", feature_type: "Point", className: "" },
    { title: "River Ports", value: "river_ports", color: "white", type: "geojson_file", feature_type: "Point", className: "" },
    { title: "Cargo Ports", value: "cargo_port", color: "white", type: "geojson_file", feature_type: "Point", className: "" },
    { title: "Collection Port", value: "collection_port", color: "white", type: "geojson_file", feature_type: "Point", className: "" },
    { title: "Feeder Port", value: "feeder_port", color: "white", type: "geojson_file", feature_type: "Point", className: "" },
    { title: "Fish Storage", value: "fish_storage", color: "white", type: "geojson_file", feature_type: "Point", className: "" },
    { title: "Fish Distribution Port", value: "fish_desribution_port", color: "white", type: "geojson_file", feature_type: "Point", className: "border-b border-gray-500 pb-2" },
    // Other
    { title: "Truck Weighing", value: "truck_weight", color: "white", type: "geojson_file", feature_type: "Point" },
    { title: "Train Station", value: "train_station", color: "white", type: "geojson_file", feature_type: "Point" },
    // { title: "Mining Areas", value: "mining", color: "#b8860b", type: "geojson_file", feature_type: "Polygon" },
    // { title: "RPR7", value: "rpr7", color: "white", type: "geojson_file", feature_type: "Polygon" },
];
export type LayerSettings = typeof filterOptions[number];

export type MapSettings = {
    zoom: number,
    lat: number,
    lng: number,
    bearing: number,
    pitch: number,
}
export const zoomAtom = atomWithStorage<number>('zoom', 15)
export const mapLayersAtom = atomWithStorage<LayerSettings[]>('map_layers', [filterOptions[0] as LayerSettings])
export const mapSettingsAtom = atomWithStorage<MapSettings>('map_settings', {
    zoom: 15,
    lat: -8.244833,
    lng: 115.104819,
    bearing: 320,
    pitch: 30,
})


export default function MapSettings() {
    const [mapLayers, setMapLayers] = useAtom(mapLayersAtom)
    console.log(mapLayers, "mapLayers")

    const handleChange = (newOption: LayerSettings) => {
        if (mapLayers.some(r => r.value === newOption.value)) {
            setMapLayers(mapLayers.filter(r => r.value !== newOption.value));
        } else {
            setMapLayers([...mapLayers, newOption]); // Create a new array with the new option added
        }
    };

    return (
        <>
            <div className="flex flex-col py-2 w-full h-full px-2 overflow-auto">
                {filterOptions.map(option => (
                    <div key={option.value} className={"flex items-center me-4 my-1 cursor-pointer " + option.className}>
                        <div className="checkbox-wrapper-8">
                            <input
                                className="tgl tgl-skewed"
                                id={option.value}
                                onChange={() => handleChange(option)}
                                type="checkbox"
                                checked={mapLayers.some((r: LayerSettings) => r.value === option.value)}
                            />
                            <label
                                className="tgl-btn"
                                data-tg-off="OFF"
                                data-tg-on="ON"
                                htmlFor={option.value}
                            ></label>
                        </div>
                        {option.type === "geojson_file" && option.feature_type === "Point" ? (
                            <img src={`/map-icons/${option.value}.jpeg`} alt={option.title} className="w-6 h-6 ml-3" />
                        ) : (
                            <div className={`w-6 h-6 ml-3 border-2 border-grey-900 rounded`} style={{ backgroundColor: option.color }}></div>
                        )}
                        <label
                            htmlFor={option.value}
                            className="cursor-pointer hover:text-white font-bold ms-3 text-base text-gray-400"
                        >
                            {option.title}
                        </label>
                    </div>
                ))}
            </div>
        </>
    )
}
