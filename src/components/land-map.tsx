'use client';
import * as React from 'react';
import Map, {Source, Layer, Popup} from 'react-map-gl';
import type {SkyLayer} from 'react-map-gl';
import type { FeatureCollection, Feature } from 'geojson';
import type { Land } from '~/server/lands';
//import 'react-map-gl/src/mapbox/';
const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const skyLayer: SkyLayer = {
  id: 'sky',
  type: 'sky',
  paint: {
    'sky-type': 'atmosphere',
    'sky-atmosphere-sun': [0.0, 0.0],
    'sky-atmosphere-sun-intensity': 15
  }
};
type HoverInfo = {
    feature: Feature;
    lat: number;
    lng: number;
    x: number;
    y: number;
}

export default function LandMap({mapData, onClick, lon=115.104819, lat=-8.244833, zoom=15 }: {mapData?: FeatureCollection | null, onClick?: () => void, lat?: number, lon?: number, zoom?: number}) {
const [hoverInfo, setHoverInfo] = React.useState<HoverInfo | null>(null);


const onHover = React.useCallback((event: any) => {
    const {
        features,
        point: {x, y}
    } = event;
    console.log("event: ", event)
    const hoveredFeature = features && features[0];
    console.log("Feature: ", features)

   setHoverInfo(hoveredFeature && {feature: hoveredFeature, x, y, lat: event.lngLat.lat, lng: event.lngLat.lng});
    }, []);
    
    const onMapClick = React.useCallback((event: any) => {
        const {
            features,
            point: {x, y}
        } = event;
        
          if (features && features.length > 0) {
            const clickedFeature = features[0];
            console.log("Clicked feature: ", clickedFeature)
          } else {
            console.log("Clicked on map NULL")
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
          bearing: 60,
          pitch: 0
        }}
        onMouseMove={onHover}
        onClick={onMapClick}
        maxPitch={85}
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        mapboxAccessToken={TOKEN}
        interactiveLayerIds={['landData']}
        terrain={{source: 'mapbox-dem', exaggeration: 1.5}}
        style={{ width: '100%', height: '100%', margin:0, padding:0 }}
        attributionControl={false}
      >
       {mapData && (
        <>
          <Source
              id="landData"
              type="geojson"
              data={mapData}
          >
          <Layer
              interactive={true}
              
              id="layerData"
              source="landData"
              type="fill"
              paint={{
              'fill-color': '#088',
              'fill-opacity': 0.8,
              'fill-outline-color': '#000', // Added border color
              }}
          />
          </Source>
            <>
                {hoverInfo && (
                    <Popup
                        longitude={hoverInfo.lng}
                        latitude={hoverInfo.lat}
                        offset={-10}
                        closeButton={false}
                    >
                        {Object.entries(hoverInfo.feature.properties || {}).map(([key, value]) => (
                          <div key={key}>{`${key.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}: ${value}`}</div>
                        ))}
                    </Popup>
                )}
            </>
          </>
        )}
      </Map>
    </>
  );
}