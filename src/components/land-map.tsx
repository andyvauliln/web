'use client';
import * as React from 'react';
import Map, { Source, Layer } from 'react-map-gl';
import type { MapLayerMouseEvent } from 'react-map-gl';
import type { FeatureCollection, Feature, } from 'geojson';
import type { Land } from '~/server/lands';
import { Separator } from '~/components/ui/separator';
//import * as topojson from 'topojson';

//https://github.com/nagix/mini-tokyo-3d/ cool!!!
// Bali live cameras https://www.webcamtaxi.com/en/indonesia/bali.html#google_vignette
//https://www.skylinewebcams.com/en/webcam/indonesia/bali.html
//https://balisatudata.baliprov.go.id/peta-tata-ruang
//https://balisatudata.baliprov.go.id/peta-cctv
const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

type HoverInfo = {
    feature: Feature;
    lat: number;
    lng: number;
    x: number;
    y: number;
}

export default function LandMap({ mapData, onClick, lon = 115.104819, lat = -8.244833, zoom = 15 }: { mapData?: FeatureCollection | null | undefined, onClick: (feature: Feature | null) => void, lat?: number, lon?: number, zoom?: number }) {
    const [hoverInfo, setHoverInfo] = React.useState<HoverInfo | null>(null);
    // const topology = topojson.topology({ data: mapData || { type: "FeatureCollection", features: [] } });


    const onHover = React.useCallback((event: any) => {
        const {
            features,
            point: { x, y }
        } = event;
        console.log("event: ", event)
        const hoveredFeature = features && features[0];

        setHoverInfo(hoveredFeature && { feature: hoveredFeature, x, y, id: hoveredFeature.id, lat: event.lngLat.lat, lng: event.lngLat.lng });
    }, []);

    const onMapClick = React.useCallback((event: MapLayerMouseEvent) => {
        const {
            features,
            point: { x, y }
        } = event;

        if (features && features.length > 0) {
            const clickedFeature = features[0];
            onClick(clickedFeature || null)
        } else {
            console.log("No Land in this Area")
        }
    }, []);
    return (
        <>
            <Map
                reuseMaps
                initialViewState={{
                    latitude: lat,
                    longitude: lon,
                    zoom: zoom,
                    bearing: 320,
                    pitch: 30
                }}
                onMouseLeave={() => setHoverInfo(null)}
                optimizeForTerrain={true}
                onMouseMove={onHover}
                onClick={onMapClick}
                maxPitch={85}
                mapStyle="mapbox://styles/mapbox/satellite-v9"
                mapboxAccessToken={TOKEN}
                interactiveLayerIds={['lands']}
                terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
                style={{ width: '100%', height: '100%', margin: 0, padding: 0 }}
                attributionControl={false}
            >
                {mapData && (
                    <>
                        <Source data={mapData} buffer={512} id="lands" type="geojson">

                            <Layer
                                id="lands"
                                type="fill"
                                source="lands"
                                // filter={['==', ['id'], hoverInfo?.feature?.id]}
                                paint={{
                                    'fill-color': '#fff',
                                    'fill-opacity': 0,
                                    'fill-outline-color': '#fff'
                                }}
                                layout={{
                                    'visibility': 'visible'
                                }}
                            />
                            <Layer
                                id="landData-line"
                                type="line"
                                paint={{
                                    'line-color': '#fff',
                                    'line-opacity': 0.5,
                                    'line-width': 1
                                }}
                            />

                        </Source>

                        <Source
                            id="mapbox-dem"
                            type="raster-dem"
                            url="mapbox://mapbox.mapbox-terrain-dem-v1"
                            tileSize={512}
                        // maxzoom={14}
                        />
                        <Source
                            id="mapbox-streets"
                            type="vector"
                            url="mapbox://mapbox.mapbox-streets-v8,mapbox.road-detail-v1"
                        >
                            <Layer
                                id="road"
                                source-layer="road"
                                type="line"
                                // filter={{['in', 'class', 'motorway','trunk', 'primary', 'secondary', 'tertiary', 'street', 'street_limited', 'pedestrian', 'track', 'service', 'ferry', 'path',]}}
                                //filter={['in', 'class', 'construction']}
                                // filter={['in', 'class', 'trunk', 'tertiary', 'street', 'street_limited', 'track'}
                                // filter={['in', 'class',  'service', 'ferry', 'path', 'major_rail'}
                                paint={{
                                    'line-color': '#ff0000',
                                    'line-width': 5
                                }}
                            />
                            {/* <Layer
                                id="Waterway"
                                source="mapbox-streets"
                                source-layer="waterway"
                                type="line"
                                paint={{
                                    'line-color': '#00008b', // darkblue
                                    'line-width': 5
                                }}
                                layout={{
                                    'visibility': 'visible',
                                }}
                            /> */}
                            <Layer
                                id="Admin"
                                source="mapbox-streets"
                                source-layer="admin"
                                type="line"
                                paint={{
                                    'line-color': '#800080', // purple
                                    'line-width': 5
                                }}
                                layout={{
                                    'visibility': 'visible',
                                }}
                            />
                        </Source>

                        {/* <Source
                            id="buildings"
                            type="vector"
                            url="mapbox://mapbox.mapbox-streets-v8"
                        >
                            <Layer
                                id="building"
                                type="fill-extrusion"
                                source="buildings"
                                source-layer="building"
                                filter={["==", ["get", "extrude"], "true"]}
                                paint={{
                                    "fill-extrusion-color": [
                                        "interpolate",
                                        ["linear"],
                                        ["get", "height"],
                                        0, "rgb(255, 255, 255)",
                                        100, "rgba(112, 189, 219, 0.8)",
                                        200, "rgba(45, 138, 174, 0.8)",
                                        300, "rgba(170, 219, 238, 0.8)",
                                        400, "rgba(118, 187, 214, 0.05)",
                                        430, "rgba(101, 198, 236, 0.98)",
                                        500, "rgb(255, 255, 255)",
                                        600, "rgba(150, 223, 237, 0.8)",
                                        700, "rgba(191, 217, 227, 0.8)",
                                        900, "rgba(191, 217, 227, 0.8)",
                                        1000, "rgba(79, 163, 196, 0.8)",
                                        1200, "rgba(36, 104, 143, 0.8)",
                                        1300, "rgba(166, 217, 237, 0.8)",
                                        1400, "rgba(177, 194, 201, 0.8)",
                                        1500, "rgba(255, 255, 255, 0.8)"
                                    ],
                                    "fill-extrusion-height": ["get", "height"],
                                    "fill-extrusion-base": ["get", "min_height"],
                                    "fill-extrusion-vertical-gradient": false,
                                    "fill-extrusion-opacity": 0.75,
                                }}
                            />
                        </Source> */}

                        {hoverInfo?.feature && (
                            <Source id="hoveredFeature" type="geojson" data={{ type: "FeatureCollection", features: [hoverInfo.feature] }}>
                                <Layer
                                    id="hoveredFeature"
                                    type="fill"
                                    paint={{
                                        'fill-color': '#fff',
                                        'fill-opacity': 0.1,
                                        'fill-outline-color': '#fff',
                                    }}
                                />
                            </Source>
                        )}
                        {hoverInfo && (
                            <Popover x={hoverInfo.x} y={hoverInfo.y} data={hoverInfo.feature.properties} />
                        )}
                    </>
                )}
            </Map>
        </>
    );
}

function Popover({ x, y, data }: { x: number, y: number, data: any }) {
    return <div style={{ left: 10, top: 10 }} className="p-2 opacity-80 pointer-events-none absolute z-10 inline-block w-64 text-sm text-gray-500 border border-gray-800 rounded-lg shadow-sm dark:text-gray-400 bg-black dark:border-gray-6000">
        <div className="flex justify-between items-center">
            <div className="text-base mb-2 font-semibold leading-none text-white mt-2">Land Details</div>
            <div className='flex gap-2'>
                <span className='inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground shadow'>Rent</span>
                <span className='inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground '>Buy</span>
                {/* <span className='inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'>Sold</span> */}
            </div>
        </div>
        <Separator className='my-2' orientation='horizontal' />
        <ul className="flex flex-col text-sm">
            <li className="me-2">
                <span className='mr-2 font-semibold'>Land Size:</span>
                <span className="text-white">799m2</span>
            </li>
            <li className="me-2">
                <span className='mr-2 font-semibold '>Zone:</span>
                <span className="text-white">Yellow</span>
            </li>
            <li className="me-2">
                <span className='mr-2 font-semibold '>Total Price:</span>
                <span className="text-white">234$</span>
            </li>
            <li className="me-2">
                <span className='mr-2 font-semibold '>Price per m2 :</span>
                <span className="text-white">234$</span>
            </li>
            <li className="me-2">
                <span className='mr-2 font-semibold '>Price per m2, yearly:</span>
                <span className=" text-white">234$</span>
            </li>
            <li className="me-2">
                <span className='mr-2 font-semibold '>Partly:</span>
                <span className=" text-white">Possible</span>
            </li>
            <li className="me-2">
                <span className='mr-2 font-semibold'>Negotiable:</span>
                <span className=" text-white">Yes</span>
            </li>
        </ul>
        <Separator className='my-2' orientation='horizontal' />
        <span>Click to get more details...</span>
    </div>
}

// 'motorway': These are high-speed, grade-separated highways. They are typically used by cars, trucks, and other motor vehicles. Examples include interstates in the U.S., autobahns in Germany, and motorways in the U.K.
// 'trunk': These are important roads that are not motorways. They are often major routes within a country and can be used by all types of vehicles. Examples include U.S. highways that are not interstates.
// 'primary': These are major highways linking large towns. They can be used by all types of vehicles. Examples include state highways in the U.S. and A roads in the U.K.
// 'secondary': These are highways linking large towns. They can be used by all types of vehicles. Examples include county highways in the U.S. and B roads in the U.K.
// 'tertiary': These are roads linking small settlements, or the local centers of a large town or city. They can be used by all types of vehicles. Examples include main streets in small towns.
// 'street': These are standard unclassified, residential, road, and living_street road types. They can be used by all types of vehicles, as well as pedestrians and cyclists. Examples include residential streets and city streets.
// 'street_limited': These are streets that may have limited or no access for motor vehicles. They can be used by pedestrians, cyclists, and sometimes local traffic. Examples include pedestrian zones in city centers.
// 'pedestrian': These include pedestrian streets, plazas, and public transportation platforms. They are primarily used by pedestrians, but may also be used by cyclists. Examples include pedestrian zones and sidewalks.
// 'track': These are roads mostly for agricultural and forestry use. They can be used by farm vehicles, forestry vehicles, and sometimes other vehicles. Examples include farm tracks and logging roads.
// 'service': These are access roads, alleys, agricultural tracks, and other services roads. Also includes parking lot aisles, and public and private driveways. They can be used by all types of vehicles, but are primarily intended for local access. Examples include alleys, driveways, and parking lot aisles.
// 'ferry': These are routes where a boat that may take passengers on foot, in motor vehicles, or both. Examples include ferry routes across rivers and lakes.
// 'path': These are foot paths, cycle paths, ski trails. They are primarily used by pedestrians, cyclists, and in some cases skiers. Examples include hiking trails, bike paths, and ski trails.


// const bbox = [-74.04728500751165, 40.68291694544512, -73.90665099539478, 40.87903804730722]; // Example bbox for New York
//     const viewport = new WebMercatorViewport(this.state.viewport);
//     const {longitude, latitude, zoom} = viewport.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], {padding: 20});