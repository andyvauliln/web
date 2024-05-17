'use client'
import React from 'react';
import DeckGL from '@deck.gl/react';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import type { FeatureCollection, Feature, Geometry, GeoJsonProperties } from 'geojson';
import { mapSettingsAtom, mapLayersAtom, LayerSettings, zoomAtom, MapSettings } from './property-map-settings';
import { useAtom } from 'jotai';
import { LineLayer, GeoJsonLayer, BitmapLayer, IconLayer } from '@deck.gl/layers';
import { Tile3DLayer, MVTLayer } from '@deck.gl/geo-layers';
import type { Tileset3D } from '@loaders.gl/tiles';
import { _TerrainExtension as TerrainExtension, DataFilterExtension } from '@deck.gl/extensions';
import { Popover, HoverInfo, GOOGLE_MAP_API_KEY, TILESET_URL, googleCustomFetch, roadColorMapping, lightingEffect, RoadClassType, MAP_BOX_TOKEN, customFetch } from './deck-map-settings';
import type { AccessorContext } from '@deck.gl/core';
import type { _TileLoadProps as TileLoadProps } from '@deck.gl/geo-layers';
interface MapProps {
    mapData?: FeatureCollection | null | undefined;
    onClick: (feature: Feature | null) => void;
}

// export async function customTileLoader(props: TileLoadProps): Promise<ArrayBuffer | null> {
//     console.log('customTileLoader called with props:', props);
//     try {
//         const response = await fetch(props.url);
//         if (!response.ok) {
//             console.error('Failed to fetch tile:', response.statusText);
//             return null;
//         }
//         return await response.arrayBuffer();
//     } catch (error) {
//         console.error('Error fetching tile:', error);
//         return null;
//     }
// }

export default function DeckMap({ mapData, onClick }: MapProps) {
    const [mapSettings, setMapSettings] = useAtom<MapSettings>(mapSettingsAtom)
    const [hoverInfo, setHoverInfo] = React.useState<HoverInfo | null>(null);
    const [mapLayers, setMapLayers] = useAtom<LayerSettings[]>(mapLayersAtom)
    const [viewState, setViewState] = React.useState({
        latitude: mapSettings.lat,
        longitude: mapSettings.lng,
        zoom: mapSettings.zoom,
        bearing: mapSettings.bearing,
        pitch: mapSettings.pitch,
        minZoom: 5,
    });

    const handleViewStateChange = (newViewState: any) => {
        if (newViewState.zoom > 19) {
            newViewState.zoom = 14;
        }
        setViewState(newViewState);
    };


    const layers = [
        new Tile3DLayer({
            id: 'google-3d-tiles',
            data: TILESET_URL,
            loadOptions: {
                fetch: {
                    headers: {
                        'X-GOOG-API-KEY': GOOGLE_MAP_API_KEY
                    },
                    cashe: "force-cache"
                },
            },
            // fetch: googleCustomFetch,
            onTilesetLoad: (tileset3d: Tileset3D) => {
                // console.log(tileset3d, 'tileset3d')
                tileset3d.options.onTraversalComplete = (selectedTiles) => {
                    const credits = new Set();
                    selectedTiles.forEach(tile => {
                        const { copyright } = tile.content.gltf.asset;
                        copyright.split(';').forEach(credits.add, credits);
                    });
                    return selectedTiles;
                }
            },
            operation: 'terrain+draw',
        }),

        // mapLayers.some(layer => layer.type === "map_layer" && layer.value.includes("road")) && new MVTLayer({
        //     id: 'roads',
        //     bounds: [114.5615, -8.8095, 115.7364, -8.0922],
        //     data: `https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/{z}/{x}/{y}.mvt?access_token=${MAP_BOX_TOKEN}`,
        //     minZoom: 0,
        //     maxZoom: 19,
        //     extensions: [
        //         new TerrainExtension(),
        //     ],
        //     // lineJointRounded: true,
        //     // lineCapRounded: true,
        //     getFillColor: [0, 0, 0, 0],
        //     // getLineColor: [255, 215, 0, 128], // RGB for #FFD700
        //     lineWidthMinPixels: 2,
        //     lineWidthMaxPixels: 5,
        //     lineWidthScale: 0.5,
        //     getLineColor: (feature: Feature<Geometry, GeoJsonProperties>): [number, number, number] => {
        //         const roadClass = feature.properties?.class as RoadClassType;
        //         if (roadClass && roadColorMapping.hasOwnProperty(roadClass)) {
        //             return roadColorMapping[roadClass] as [number, number, number];
        //         }
        //         return [255, 255, 255]; // Ensure this is a tuple of three numbers
        //     },
        //     // filter: ({ properties }: { properties: { class: string } }) => ['motorway', 'primary', 'secondary', 'street'].includes(properties.class),
        // }),
        // new MVTLayer({
        //     id: 'rivers',
        //     data: `https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/{z}/{x}/{y}.mvt?access_token=${MAP_BOX_TOKEN}`,
        //     fetch: customFetch,
        //     minZoom: 0,
        //     maxZoom: 19,
        //     bounds: [114.5615, -8.8095, 115.7364, -8.0922],
        //     extensions: [
        //         new TerrainExtension(),
        //         // new DataFilterExtension({ filterSize: 1 }),
        //     ],
        //     sourceLayer: 'water',
        //     //getLineColor: [30, 144, 255], // Dodger blue for water
        //     lineWidthMinPixels: 2,
        //     getFillColor: [0, 0, 0, 0],
        //     lineWidthMaxPixels: 5,
        //     lineWidthScale: 0.5,
        //     // filterRange: [1, 1],
        //     getLineColor: (feature) => {
        //         console.log(feature.properties.class, feature.properties.type, 'type of point')
        //         if (feature.properties.class === 'water') {
        //             return [30, 144, 255]
        //         }
        //         return [0, 0, 0, 0]
        //     },
        // getFilterValue: (feature: any) => {
        //     console.log(feature.type, 'feature')
        //     return feature.properties.type === 'river' ? 1 : 0;
        // },
        // }),

        // new GeoJsonLayer({
        //     id: 'geojson-layer',
        //     data: mapData || [],
        //     pickable: true,
        //     stroked: true,
        //     extensions: [
        //         new TerrainExtension(),
        //     ],
        //     filled: true,
        //     lineWidthMinPixels: 1,
        //     autoHighlight: true,
        //     highlightColor: [255, 255, 255, 75],
        //     getLineColor: [255, 255, 255, 255],
        //     getLineWidth: 2,
        //     getFillColor: (info: { object: Feature<Geometry, GeoJsonProperties> }): [number, number, number] => {
        //         return info?.object?.id === hoverInfo?.object?.id ? [255, 255, 255] : [0, 0, 0];
        //     },
        //     opacity: 0.2,
        //     onClick: (info) => {
        //         onClick(info.object)
        //     },
        //     onHover: (info: HoverInfo) => {
        //         setHoverInfo(info.object ? {
        //             x: info.x,
        //             y: info.y,
        //             object: info.object
        //         } : null);
        //     }
        // }),

        // mapLayers.filter(layer => layer.type === "geojson_file").map(layer => {

        //     if (layer.feature_type === "Point") {
        //         return new GeoJsonLayer({
        //             id: `layer-id-${layer.value}`,
        //             data: `/bali-data-geojson/points/${layer.value}.geojson`,
        //             pickable: true,
        //             autoHighlight: true,
        //             pointType: 'icon',
        //             iconAtlas: `/map-icons/${layer.value}.jpeg`,
        //             iconMapping: {
        //                 marker: {
        //                     x: 0,
        //                     y: 0,
        //                     width: 1024,
        //                     height: 1024,
        //                     anchorY: 1024,
        //                     mask: false
        //                 }
        //             },
        //             iconSizeMinPixels: 20,
        //             iconSizeMaxPixels: 50,
        //             iconSizeScale: 0.5,
        //             getPosition: (d: Feature<Geometry, GeoJsonProperties>) => {
        //                 // console.log(d, 'd')
        //                 if ('coordinates' in d.geometry) {
        //                     return d.geometry.coordinates;
        //                 }
        //                 console.error('Invalid geometry type for coordinates access');
        //                 return [0, 0];
        //             },
        //             extensions: [
        //                 new TerrainExtension(),
        //             ],
        //             getIcon: (d: Feature<Geometry, GeoJsonProperties>) => 'marker',
        //         })
        //     } else if (layer.feature_type === "Polygon") {
        //         return new GeoJsonLayer({
        //             id: `layer-id-${layer.value}`,
        //             data: `/bali-data-geojson/poligons/${layer.value}.geojson`,
        //             pickable: true,
        //             stroked: true,
        //             extensions: [
        //                 new TerrainExtension(),
        //             ],
        //             filled: true,
        //             lineWidthMinPixels: 1,
        //             autoHighlight: true,
        //             highlightColor: [255, 255, 255, 75],
        //             getLineColor: [255, 255, 255, 255],
        //             getLineWidth: 2,
        //             getFillColor: ((info: HoverInfo): [number, number, number, number] =>
        //                 info.object === hoverInfo ? [255, 255, 255, 255] : [0, 0, 0, 0]) as unknown as [number, number, number, number],
        //             opacity: 0.2,
        //             // onHover: info => setHoverInfo(info.object ? {
        //             //     x: info.x,
        //             //     y: info.y,
        //             //     object: info.object
        //             // } : null)
        //         })
        //     }
        //     else {
        //         return new GeoJsonLayer({
        //             id: `layer-id-${layer.value}`,
        //             data: `/bali-data-geojson/lines/${layer.value}.geojson`,
        //             pickable: true,
        //             stroked: true,
        //             extensions: [
        //                 new TerrainExtension(),
        //             ],
        //             lineWidthMinPixels: 1,
        //             autoHighlight: true,
        //             highlightColor: [255, 255, 255, 75],
        //             getLineColor: layer.color || [255, 255, 255, 255],
        //             getLineWidth: 2,
        //             opacity: 0.2,
        //             // onHover: info => setHoverInfo(info.object ? {
        //             //     x: info.x,
        //             //     y: info.y,
        //             //     object: info.object
        //             // } : null)
        //         })
        //     }
        // })


    ]

    return <DeckGL
        style={{ backgroundColor: '#061714' }}
        initialViewState={viewState}
        onViewStateChange={({ viewState }) => handleViewStateChange(viewState)}
        controller={true}
        layers={[layers]}
    // effects={[lightingEffect]}
    >
        {/* <Map reuseMaps mapStyle={MAP_STYLE} /> */}
        {hoverInfo && <Popover x={hoverInfo?.x} y={hoverInfo?.y} data={hoverInfo?.object} />}
    </DeckGL>;
}


