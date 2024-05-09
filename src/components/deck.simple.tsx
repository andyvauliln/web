'use client'
import React from 'react';
import DeckGL from '@deck.gl/react';
import type { Entity, Viewer } from 'cesium';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import type { FeatureCollection, Feature, } from 'geojson';
import { Separator } from '~/components/ui/separator';
import { mapSettingsAtom, mapLayersAtom, LayerSettings, zoomAtom, MapSettings } from './property-map-settings';
import { useAtom } from 'jotai';
import Image from 'next/image';
import { TerrainLayer, TerrainLayerProps } from '@deck.gl/geo-layers';
import type { MapViewState } from '@deck.gl/core';
import { LineLayer, GeoJsonLayer } from '@deck.gl/layers';
import { Tile3DLayer } from '@deck.gl/geo-layers';
import type { Tileset3D } from '@loaders.gl/tiles';
import { _TerrainExtension as TerrainExtension, DataFilterExtension } from '@deck.gl/extensions';
import { CesiumIonLoader } from '@loaders.gl/3d-tiles';
import { FlyToInterpolator } from '@deck.gl/core';
import { Matrix4 } from 'math.gl';
import { scaleLinear } from 'd3-scale';
import { FirstPersonView } from '@deck.gl/core';
import { Map } from 'react-map-gl';
import { LightingEffect, AmbientLight, _SunLight as SunLight } from '@deck.gl/core';

interface MapProps {
    mapData?: FeatureCollection | null | undefined;
    onClick: (feature: Feature | null) => void;
}

const TILESET_URL = `https://tile.googleapis.com/v1/3dtiles/root.json`;
const BUILDINGS_URL = 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/google-3d-tiles/buildings.geojson'
const GOOGLE_MAP_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY1
const CESIUM_ION_TOKEN = process.env.NEXT_PUBLIC_CESIUM_TOKEN1

export default function DeckMap({ mapData, onClick }: MapProps) {
    const [mapSettings, setMapSettings] = useAtom<MapSettings>(mapSettingsAtom)

    const layer = [
        new Tile3DLayer({
            id: 'google-3d-tiles',
            data: TILESET_URL,
            loadOptions: {
                fetch: {
                    headers: {
                        'X-GOOG-API-KEY': GOOGLE_MAP_API_KEY
                    }
                }
            },
            onTilesetLoad: (tileset3d: Tileset3D) => {
                console.log(tileset3d, 'tileset3d')
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
            opacity: 0.5
        }),
        new GeoJsonLayer({
            id: 'geojson-layer',
            data: mapData || [],
            pickable: true,
            stroked: true,
            filled: true,
            extruded: false,
            lineWidthMinPixels: 2,
            getFillColor: [160, 160, 180, 200], // RGBA color for the fill
            getLineColor: [0, 0, 0, 255], // RGBA color for the stroke
            getLineWidth: 1,
            modelMatrix: new Matrix4().translate([0, 0, -10]), // Adjust the -10 to align with your 3D tiles
        })
    ]

    return <DeckGL
        style={{ backgroundColor: '#061714' }}
        initialViewState={{
            latitude: mapSettings.lat,
            longitude: mapSettings.lng,
            zoom: mapSettings.zoom,
            bearing: mapSettings.bearing,
            pitch: mapSettings.pitch,
            minZoom: 10,
        }}
        controller={true}
        // getTooltip={getTooltip}
        layers={[layer]}
    // effects={effects}
    >
        {/* <Map reuseMaps mapStyle={MAP_STYLE} /> */}
    </DeckGL>;
}


