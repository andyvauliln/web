'use client'

import React from 'react'
import type { Entity, Viewer } from 'cesium';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import type { FeatureCollection, Feature, } from 'geojson';
import { Separator } from '~/components/ui/separator';
import { mapSettingsAtom, mapLayersAtom, LayerSettings, zoomAtom, MapSettings } from './property-map-settings';
import { useAtom } from 'jotai';
import Image from 'next/image';

interface CesiumComponentProps {
    CesiumJs: CesiumType;
    mapData?: FeatureCollection | null | undefined;
    onClick: (feature: Feature | null) => void;
}

type HoverInfo = {
    feature: Feature;
    lat: number;
    lng: number;
    x: number;
    y: number;
}

export const CesiumComponent: React.FunctionComponent<CesiumComponentProps> = ({
    CesiumJs,
    mapData,
    onClick
}) => {
        const cesiumViewer = React.useRef<Viewer | null>(null);
        const cesiumContainerRef = React.useRef<HTMLDivElement>(null);
        const [isLoaded, setIsLoaded] = React.useState(false);
        const [hoverInfo, setHoverInfo] = React.useState<HoverInfo | null>(null);
        const [mapSettings, setMapSettings] = useAtom<MapSettings>(mapSettingsAtom)
        const [mapLayers, setMapLayers] = useAtom<LayerSettings[]>(mapLayersAtom)

        const onMouseMove = (movement: any) => {
            // if (cesiumViewer.current) {
            //     const pickedFeature = cesiumViewer.current.scene.pick(movement.endPosition);
            //     if (Cesium.defined(pickedFeature)) {
            //         const featureId = pickedFeature.id;
            //         const featureData = mapData?.features.find(data => data.id === featureId);
            //         if (featureData) {
            //             setHoverInfo({
            //                 feature: pickedFeature,
            //                 lat: featureData.lat,
            //                 lng: featureData.lng,
            //                 x: movement.endPosition.x,
            //                 y: movement.endPosition.y
            //             });
            //             pickedFeature.color = Cesium.Color.YELLOW; // Change color on hover
            //         }
            //     } else {
            //         if (hoverInfo) {
            //             hoverInfo.feature.color = Cesium.Color.WHITE; // Reset color when not hovering
            //             setHoverInfo(null);
            //         }
            //     }
            // }
        };


        React.useEffect(() => {
            const initializeCesium = async () => {
                if (cesiumViewer.current === null && cesiumContainerRef.current) {
                    cesiumViewer.current = new CesiumJs.Viewer(cesiumContainerRef.current, getViewerOptions(CesiumJs));
        
                    cesiumViewer.current.scene.camera.setView(initialCameraPosition);
                    await asyncLoadData(CesiumJs, cesiumViewer.current, mapData);
                    // add bbox check
                    //var screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(cesiumViewer.current.scene.canvas);
                    //screenSpaceEventHandler.setInputAction(bboxCheck(cesiumViewer.current), Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                    // load tileset
                    loadTileset(CesiumJs, cesiumViewer.current);

                    return () => {
                        cesiumViewer.current?.destroy();
                    };
                }
            };
        
            initializeCesium();
        }, []);



        return (
            <div
                ref={cesiumContainerRef}
                id='cesium-container'
                style={{ height: '100%', width: '100%' }}
            />
        )
    }
    function Popover({ x, y, data }: { x: number, y: number, data: any }) {
        return <div style={{ left: 10, top: 10 }} className="p-1 flex flex-col pointer-events-none absolute z-10 ">
            <div className='opacity-80 p-2 inline-block w-64 text-sm text-gray-500 border border-gray-800 rounded-lg shadow-sm bg-black'>
                <div className="flex justify-between items-center">
                    <div className="text-base mb-2 font-semibold leading-none text-white mt-2">Land Details</div>
                    <div className='flex gap-2'>
                        <span className='inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground shadow'>Rent</span>
                        <span className='inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground '>Buy</span>
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
            <div className="my-4">
                <Image className='rounded-md' src="/land_sideman.gif" alt="Your GIF" width={300} height={200} />
            </div>
        </div>
    }



const initialCameraPosition = {
    destination: Cesium.Cartesian3.fromDegrees(115.111705, -8.258207, 3000),
    orientation: {
        heading: Cesium.Math.toRadians(270),
        pitch: Cesium.Math.toRadians(-40),
        roll: 0,
    },
}

const asyncLoadData = async (CesiumJs: CesiumType, cesiumViewer: Viewer, mapData: FeatureCollection | null | undefined) => {
    console.log(mapData?.features[0], "MapData")
   cesiumViewer.dataSources.add(Cesium.GeoJsonDataSource.load(mapData, {
    stroke: Cesium.Color.HOTPINK,
    fill: Cesium.Color.PINK,
    strokeWidth: 3
}));
};

const loadTileset = async (CesiumJs: CesiumType, cesiumViewer: Viewer) => {
    try {
        const tileset = await CesiumJs.Cesium3DTileset.fromIonAssetId(2275207);
        tileset.show = true;
        tileset.dynamicScreenSpaceError = true;
        tileset.dynamicScreenSpaceErrorFactor = 24;
        cesiumViewer.scene.primitives.add(tileset);
        // const osmBuildingsTileset = await CesiumJs.Cesium3DTileset.fromIonAssetId(96188);
        // cesiumViewer.scene.primitives.add(osmBuildingsTileset);
    } catch (error) {
        console.error(error);
    }
};

var boundingBox = new Cesium.Rectangle(
    Cesium.Math.toRadians(114.10), // West
    Cesium.Math.toRadians(-8.90),   // South
    Cesium.Math.toRadians(115.70), // East
    Cesium.Math.toRadians(-8.10)    // North
);
function bboxCheck(cesiumViewer: Viewer) {
    return function (movement: any) { // Adjust the parameter type based on expected event data
        if (cesiumViewer && cesiumViewer.scene) {
            // Get the current camera position in cartographic coordinates
            var cameraPosition = cesiumViewer.scene.camera.positionCartographic;
            var longitude = cameraPosition.longitude;
            var latitude = cameraPosition.latitude;

            // Check if the camera position is outside the bounding box
            if (
                longitude < boundingBox.west ||
                longitude > boundingBox.east ||
                latitude < boundingBox.south ||
                latitude > boundingBox.north
            ) {
                cesiumViewer.scene.camera.flyTo({
                    destination: initialCameraPosition.destination,
                    orientation: initialCameraPosition.orientation
                });
            }
        }
    };
}
Cesium.Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_TOKEN1 || '';

const getViewerOptions = (CesiumJs: CesiumType): Cesium.Viewer.ConstructorOptions => {
    return {
        globe: new CesiumJs.Globe(),// new CesiumJs.Globe(new CesiumJs.Ellipsoid()), // Disables the globe to not render Earth
        skyAtmosphere: new CesiumJs.SkyAtmosphere(), // Adds atmospheric effects around the Earth
        // sceneModePicker: false, // Disables the widget to switch between 3D, 2D, and Columbus View modes
        // baseLayerPicker: false, // Disables the widget to select different imagery and terrain base layers
        // geocoder: false, // Disables the geocoder widget for searching locations
        // homeButton: false, // Disables the home button to reset the view to the default position
        // infoBox: false, // Disables the info box that appears when an object is clicked
        // selectionIndicator: false, // Disables the selection indicator which shows the selected object's location
        // timeline: false, // Disables the timeline widget at the bottom of the screen
        // navigationHelpButton: false, // Disables the button that shows navigation instructions
        // fullscreenButton: false, // Disables the fullscreen button
        // animation: false, // Disables the animation widget used to control the time animation
        // vrButton: false, // Disables the VR button for virtual reality mode
        // scene3DOnly: true, // Forces the scene to always use 3D mode
        // navigationInstructionsInitiallyVisible: false, // Initially hides the navigation instructions
        // msaaSamples: 4, //? Sets the number of samples used for multi-sample anti-aliasing to improve visual quality
        // shouldAnimate: false,
        // useDefaultRenderLoop: true, // custome loop
        // targetFrameRate: 60, //60 max
        // useBrowserRecommendedResolution: true,
        // orderIndependentTranslucency: true, // for better visualisation of transparent feture, could be bad for performance
        // shadows: false,
        // projectionPicker: false,
         
        //showRenderLoopErrors: true, // custome loop
         // automaticallyTrackDataSourceClocks: true,
        //contextOptions: new ContextOptions(),// webgl perfomace alpha: true,depth, ..
        // sceneMode: new SceneMode(),
        //mapProjection: new MapProjection(), // WebMercatorProjection, GeographicProjection
           // creditContainer: 'credit-container',
        // creditViewport: "credi_view_port",
        //dataSources: new DataSourceCollection(),
         // terrainShadows: new ShadowMode(),
        // mapMode2D: new MapMode2D(),
        //blurActiveElementOnCanvasFocus: true,
        // requestRenderMode: true, // manual rendering
        // maximumRenderTimeChange: 0.01,
        //depthPlaneEllipsoidOffset: 0,
         // clockViewModel: new ClockViewModel(),
        // selectedImageryProviderViewModel: new ProviderViewModel(),
        // imageryProviderViewModels: new ProviderViewModel[],
        // selectedTerrainProviderViewModel: new ProviderViewModel(),
        // terrainProviderViewModels: new ProviderViewModel[],
        // terrainProvider: new TerrainProvider(),
        // terrain: new Terrain(),
        // skyBox: new SkyBox(),
        // fullscreenElement: 'full-screen-elem',
    }
}
export type Position = {
    lat: number,
    lng: number
}
export type CesiumType = typeof import('cesium');

export default CesiumComponent

// const viewer = new Viewer('cesiumContainer', {
//     imageryProvider: new Cesium.IonImageryProvider({ assetId: 2 }), // Assuming assetId 2 is your Google Photorealistic 3D Tiles
//     terrainProvider: new Cesium.CesiumTerrainProvider({
//       url: IonResource.fromAssetId(1) // Assuming assetId 1 is Cesium World Terrain
//     }),
//     baseLayerPicker: false, // Hide the base layer picker
//     // ... other viewer options
//   });


// // Create the viewer
// var viewer = new Cesium.Viewer('cesiumContainer');

// // Function to add a GeoJSON data source
// async function addGeoJson(url) {
//     const dataSource = await Cesium.GeoJsonDataSource.load(url);
//     viewer.dataSources.add(dataSource);
//     return dataSource;
// }

// // Function to remove a data source
// function removeDataSource(dataSource) {
//     viewer.dataSources.remove(dataSource, true); // true to destroy the data source
// }

// // Function to list all data sources
// function listDataSources() {
//     return viewer.dataSources.values.map(ds => ds.name);
// }

// // Usage
// async function manageDataSources() {
//     const geoJsonUrl = './path/to/geojsonfile.geojson';
//     const dataSource = await addGeoJson(geoJsonUrl);
    
//     console.log(listDataSources()); // Log list of data sources

//     removeDataSource(dataSource); // Remove the data source
// }

// manageDataSources();