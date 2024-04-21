import allLands from './all_lands.json';
import type { FeatureCollection, Feature, Geometry, Position, GeoJsonProperties } from 'geojson';

export type Land = {
  properties: {
    field_accuracy: number | null;
    survey_tools: string | null;
    land_identification_number: string | null;
    area_size_m2: number;
    value: number | null;
    number: string | null;
    year: number | null;
    ownership_type: string;
    passive_parcel_id: string;
  };
  request_data: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
  polygon: Position[][][];
};

export async function getLands(): Promise<Land[]> {
    return allLands.map((land, index) => ({
        id: index+1,
        ...land,
        polygon: [[land.polygon.map(coord => [coord[1], coord[0]] as [number, number])]]
      })) as Land[];
}

