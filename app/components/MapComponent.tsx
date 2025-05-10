import L from "leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Popup,
  Circle,
  useMap,
  LayersControl,
  LayerGroup,
} from "react-leaflet";
import "leaflet.heat";
import { useLeafletContext } from "@react-leaflet/core";

import { AirQualityData } from "@/lib/types";
import { getAqiColor } from "@/lib/utils";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface MapComponentProps {
  location: { lat: number; lon: number };
  data: AirQualityData;
}

function ChangeMapView({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon]);
  }, [lat, lon, map]);
  return null;
}

function generateHeatmapData(
  data: AirQualityData,
  location: MapComponentProps["location"],
  pollutant: keyof AirQualityData["components"]
): [number, number, number][] {
  const { lat, lon } = location;
  const pollutantValue = data.components[pollutant];
  const maxValues: Record<keyof AirQualityData["components"], number> = {
    co: 10000,
    no: 100,
    no2: 200,
    o3: 120,
    so2: 350,
    pm2_5: 75,
    pm10: 100,
    nh3: 100,
  };

  const points: [number, number, number][] = [];
  const spread = 0.02; // ~2km spread

  for (let i = 0; i < 10; i++) {
    const intensity = (pollutantValue / maxValues[pollutant]) * Math.random();
    points.push([
      lat + (Math.random() - 0.5) * spread,
      lon + (Math.random() - 0.5) * spread,
      Math.min(intensity, 1),
    ]);
  }

  return points;
}

interface HeatmapLayerProps {
  pollutant: keyof AirQualityData["components"];
  data: AirQualityData;
  location: MapComponentProps["location"];
}

function HeatmapLayer({ pollutant, data, location }: HeatmapLayerProps) {
  const context = useLeafletContext();
  const layerContainer = context.layerContainer || context.map;

  useEffect(() => {
    const heatData = generateHeatmapData(data, location, pollutant);
    const heatLayer = (L as any).heatLayer(heatData, {
      radius: 35,
      blur: 25,
      maxZoom: 15,
      gradient: {
        0.0: "blue",
        0.2: "cyan",
        0.4: "lime",
        0.6: "yellow",
        0.8: "orange",
        1.0: "red",
      },
    });

    layerContainer.addLayer(heatLayer);

    return () => {
      layerContainer.removeLayer(heatLayer);
    };
  }, [layerContainer, pollutant, data, location]);

  return null;
}

export default function MapComponent({ location, data }: MapComponentProps) {
  return (
    <MapContainer
      center={[location.lat, location.lon]}
      zoom={13}
      style={{ height: "100%", minHeight: "400px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      <ChangeMapView lat={location.lat} lon={location.lon} />

      <LayersControl position="topright">
        <LayersControl.Overlay name="AQI" checked>
          <LayerGroup>
            <Circle
              center={[location.lat, location.lon]}
              radius={1000}
              pathOptions={{
                color: getAqiColor(data.main.aqi),
                fillColor: getAqiColor(data.main.aqi),
                fillOpacity: 0.4,
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold">Air Quality Index</h3>
                  <p>AQI: {data.main.aqi}</p>
                  <p>PM2.5: {data.components.pm2_5} μg/m³</p>
                  <p>NO2: {data.components.no2} μg/m³</p>
                </div>
              </Popup>
            </Circle>
          </LayerGroup>
        </LayersControl.Overlay>

        <LayersControl.Overlay name="PM2.5 Heatmap">
          <LayerGroup>
            <HeatmapLayer pollutant="pm2_5" data={data} location={location} />
          </LayerGroup>
        </LayersControl.Overlay>

        <LayersControl.Overlay name="NO2 Heatmap">
          <LayerGroup>
            <HeatmapLayer pollutant="no2" data={data} location={location} />
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  );
}
