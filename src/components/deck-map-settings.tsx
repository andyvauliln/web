'use client'
import React from 'react';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { Separator } from '~/components/ui/separator';
import { MVTLoader } from '@loaders.gl/mvt';

import Image from 'next/image';
import { LightingEffect, AmbientLight, _SunLight as SunLight } from '@deck.gl/core';
import { getRandomLand } from './mocks';
import type { TileLoadProps } from '@deck.gl/geo-layers';
import type { BinaryFeatureCollection } from '@loaders.gl/schema';
import { parse } from '@loaders.gl/core';

export const roadColorMapping = {
    motorway: [255, 0, 0], // Red
    trunk: [255, 165, 0], // Orange
    primary: [255, 255, 0], // Yellow
    secondary: [0, 255, 0], // Green
    tertiary: [0, 0, 255], // Blue
    street: [75, 0, 130], // Indigo
    street_limited: [238, 130, 238], // Violet
    service: [255, 192, 203], // Pink
    path: [128, 128, 128], // Gray
    track: [0, 0, 0], // Black
    // Add more mappings as needed
};

// create an ambient light
const ambientLight = new AmbientLight({
    color: [255, 255, 255],
    intensity: 1.0
});
// create directional light from the sun
const directionalLight = new SunLight({
    timestamp: Date.UTC(2024, 7, 1, 22),
    color: [255, 255, 255],
    intensity: 1.0,
});
interface LoadedImages {
    [key: string]: HTMLImageElement;
}
// create lighting effect with light sources
export const lightingEffect = new LightingEffect({ ambientLight, directionalLight });

export const TILESET_URL = `https://tile.googleapis.com/v1/3dtiles/root.json`;
export const BUILDINGS_URL = 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/google-3d-tiles/buildings.geojson'
export const GOOGLE_MAP_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY6
export const CESIUM_ION_TOKEN = process.env.NEXT_PUBLIC_CESIUM_TOKEN1
export const MAP_BOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export function Popover({ x, y, data }: { x: number, y: number, data: any }) {
    console.log(data, 'data')
    const land = React.useMemo(() => {
        return getRandomLand();
    }, [data.properties.passiveParcelId]);

    return <div style={{ left: 10, top: 10 }} className="p-1 flex flex-col pointer-events-none absolute z-10 ">
        <div className='opacity-80 p-2 inline-block w-64 text-sm text-gray-500 border border-gray-800 rounded-lg shadow-sm bg-black'>
            <div className="flex justify-between items-center">
                <div className="text-base mb-2 font-semibold leading-none text-white mt-2">Land Details</div>
                <div className='flex gap-2'>
                    {land.land_bools.is_for_rent ? <span className='inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground shadow'>Rent</span> : null}
                    {land.land_bools.is_for_buy ? <span className='inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground shadow'>Buy</span> : null}
                </div>
            </div>
            <Separator className='my-2' orientation='horizontal' />
            <ul className="flex flex-col text-sm">
                <li className="me-2">
                    <span className='mr-2 font-semibold'>Land Size:</span>
                    <span className="text-white">{land.land_size}</span>
                </li>
                <li className="me-2">
                    <span className='mr-2 font-semibold '>Zone:</span>
                    <span className="text-white">{land?.land_zone?.title}</span>
                </li>
                <li className="me-2">
                    <span className='mr-2 font-semibold '>Total Price:</span>
                    <span className="text-white">{land.price.buy_price}</span>
                </li>
                <li className="me-2">
                    <span className='mr-2 font-semibold '>Price per m2 :</span>
                    <span className="text-white">{land.price.price_per_m2}</span>
                </li>
                <li className="me-2">
                    <span className='mr-2 font-semibold'>Price per m2, yearly:</span>
                    <span className=" text-white">{land.price.yearly_rent_price}</span>
                </li>
                <li className="me-2">
                    <span className='mr-2 font-semibold'>Partly:</span>
                    <span className=" text-white">{land.land_bools.is_possible_to_buy_part ? 'Yes' : 'No'}</span>
                </li>
                <li className="me-2">
                    <span className='mr-2 font-semibold'>Negotiable:</span>
                    <span className=" text-white">{land.land_bools.is_negotiable ? 'Yes' : 'No'}</span>
                </li>
            </ul>
            <Separator className='my-2' orientation='horizontal' />
            <span>Click to get more details...</span>
        </div>
        <div className="my-4">
            <Image className='rounded-md' src="/land_sideman.gif" alt="Your GIF" width={300} height={200} />
        </div>
    </div>
}

export interface HoverInfo {
    x: number;
    y: number;
    object: any;
}


let dbPromise: IDBOpenDBRequest | null = null;
const bbox: [number, number, number, number] = [114.5615, -8.8095, 115.7364, -8.0922];


//https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/13/6715/4282.mvt?access_token=pk.eyJ1IjoicHJvbXR3aXphcmQiLCJhIjoiY2x2NWtmejl6MDN1dDJ2bDc2ZzlscnQ3ZiJ9.Q9eUf40LeSNY7rQQiKbUOg
//https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/11/1679/1069.mvt?access_token=pk.eyJ1IjoicHJvbXR3aXphcmQiLCJhIjoiY2x2NWtmejl6MDN1dDJ2bDc2ZzlscnQ3ZiJ9.Q9eUf40LeSNY7rQQiKbUOg
// Custom fetch function that integrates IndexedDB storage
export async function customFetch(url: string, options: any): Promise<BinaryFeatureCollection> {
    const match = url.match(/\/(\d+)\/(\d+)\/(\d+)\.mvt/);
    if (!match) {
        throw new Error("URL format is incorrect, cannot extract tile coordinates");
    }
    const z = parseInt(match[1], 10);
    const x = parseInt(match[2], 10);
    const y = parseInt(match[3], 10);
    const tileKey = `tile-${z}-${x}-${y}`;

    console.log("Tile coordinates extracted:", tileKey);

    // Try to load from IndexedDB first
    const storedTile = await getTileFromDB(tileKey);
    if (storedTile) {
        console.log("Loaded from DB:", tileKey);
        // Parse the ArrayBuffer from IndexedDB before returning
        return parse(storedTile, MVTLoader, options.loadOptions);
    }

    // Fetch from network if not in IndexedDB
    console.log("Fetching from network:", tileKey);
    const response = await fetch(url, {
        method: 'GET',
        signal: options.signal
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    await setTileInDB(tileKey, arrayBuffer); // Store the fetched tile in IndexedDB
    console.log("Fetched from network:", tileKey, arrayBuffer);

    // Parse the ArrayBuffer before returning
    const parsedData = await parse(arrayBuffer, MVTLoader, options.loadOptions);
    console.log("Parsed data:", parsedData);
    return parsedData;
}


if (typeof window !== 'undefined' && 'indexedDB' in window) {
    dbPromise = indexedDB.open('MapTiles', 1);

    dbPromise.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('tiles')) {
            db.createObjectStore('tiles', { keyPath: 'id' });
        }
    };
}

function getTileFromDB(key: string): Promise<ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
        if (!dbPromise) {
            console.error("IndexedDB not initialized");
            resolve(null);
            return;
        }

        const transaction = dbPromise.result.transaction(['tiles'], 'readonly');
        const objectStore = transaction.objectStore('tiles');
        const request = objectStore.get(key);

        request.onsuccess = () => {
            if (request.result) {
                resolve(request.result.data);
            } else {
                resolve(null);
            }
        };

        request.onerror = () => {
            console.error("Error fetching data from IndexedDB:", request.error);
            reject(request.error);
        };
    });
}

function setTileInDB(key: string, data: ArrayBuffer): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        if (!dbPromise) {
            console.error("IndexedDB not initialized");
            resolve(data); // Resolve with the original data if DB is not initialized
            return;
        }

        const transaction = dbPromise.result.transaction(['tiles'], 'readwrite');
        const objectStore = transaction.objectStore('tiles');
        const request = objectStore.put({ id: key, data: data });

        request.onsuccess = () => {
            resolve(data); // Resolve with the original data once it's successfully stored
        };

        request.onerror = () => {
            console.error("Error saving data to IndexedDB:", request.error);
            reject(request.error); // Reject the promise if there's an error
        };

        // Handle transaction errors
        transaction.onerror = () => {
            console.error("Transaction error:", transaction.error);
            reject(transaction.error);
        };
    });
}
