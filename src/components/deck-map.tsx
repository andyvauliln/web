import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Map } from 'react-map-gl/maplibre';
import { AmbientLight, PointLight, LightingEffect } from '@deck.gl/core';
import DeckGL from '@deck.gl/react';
import { PolygonLayer, GeoJsonLayer } from '@deck.gl/layers';
import { TripsLayer } from '@deck.gl/geo-layers';
import { animate } from 'popmotion';
import { TerrainLayer, TerrainLayerProps } from '@deck.gl/geo-layers';

import type { Position, Color, Material, MapViewState } from '@deck.gl/core';
import { Feature } from 'maplibre-gl';
import { FeatureCollection } from 'geojson';

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const INITIAL_VIEW_STATE: MapViewState = {
    longitude: 115.104819,
    latitude: -8.244833,
    zoom: 13,
    pitch: 45,
    bearing: 0
};

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';
const TERRAIN_IMAGE = `https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.png?access_token=${TOKEN}`;
const SURFACE_IMAGE = `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.png?access_token=${TOKEN}`;

const MAPZEN_TERRAIN_IMAGES = `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png`;
const ARCGIS_STREET_MAP_SURFACE_IMAGES =
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const MAPZEN_ELEVATION_DECODE_PARAMETERS = {
    rScaler: 256,
    gScaler: 1,
    bScaler: 1 / 256,
    offset: -32768
};

const landCover: Position[][] = [
    [
        [-74.0, 40.7],
        [-74.02, 40.7],
        [-74.02, 40.72],
        [-74.0, 40.72]
    ]
];

const ELEVATION_DECODER: TerrainLayerProps['elevationDecoder'] = {
    rScaler: 6553.6,
    gScaler: 25.6,
    bScaler: 0.1,
    offset: -10000
};



export default function DeckMap({ mapData, onClick, lon = 115.104819, lat = -8.244833, zoom = 15 }: { mapData?: FeatureCollection | null, onClick?: () => void, lat?: number, lon?: number, zoom?: number }) {

    // const layers = mapData ? [
    //     new GeoJsonLayer<Feature>({
    //         id: 'geojson',
    //         data: [],
    //         opacity: 0.5,
    //         stroked: false,
    //         filled: true,
    //         extruded: true,
    //         getFillColor: [0, 0, 0, 0]
    //     }),
    // ] : [];
    const texture = SURFACE_IMAGE;
    const wireframe = false;

    // const layer = new TerrainLayer({
    //     id: 'terrain',
    //   maxZoom: 13,
    //   elevationDecoder: MAPZEN_ELEVATION_DECODE_PARAMETERS,
    //   elevationData: MAPZEN_TERRAIN_IMAGES,
    //   texture: ARCGIS_STREET_MAP_SURFACE_IMAGES,
    //   color: [255, 255, 255]
    // });
    const layer = new TerrainLayer({
        id: 'terrain',
        minZoom: 0,
        maxZoom: 23,
        strategy: 'no-overlap',
        elevationDecoder: MAPZEN_ELEVATION_DECODE_PARAMETERS,
        elevationData: ARCGIS_STREET_MAP_SURFACE_IMAGES,
        texture,
        wireframe,
        color: [255, 255, 255]
    });
    //layers.push(layer);
    // const layers = [
    //     // This is only needed when using shadow effects
    //     new PolygonLayer<Position[]>({
    //         id: 'ground',
    //         data: landCover,
    //         getPolygon: f => f,
    //         stroked: false,
    //         getFillColor: [0, 0, 0, 0]
    //     })
    // ];

    return (
        <DeckGL
            layers={[layer]}
            initialViewState={INITIAL_VIEW_STATE}
            controller={true}
        >
            <Map reuseMaps
                mapStyle={`https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png`}
                // mapStyle={`MAP_STYLE}
                mapboxAccessToken={TOKEN}
                //terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
                terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
                style={{ width: '100%', height: '100%', margin: 0, padding: 0 }}
                maxPitch={85}
                attributionControl={false}
            />
        </DeckGL>
    );
}