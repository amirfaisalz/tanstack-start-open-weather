import L from "leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Popup, Circle, useMap } from "react-leaflet";

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

export default function MapComponent({ location, data }: MapComponentProps) {
  const aqi = data.main.aqi;

  return (
    <MapContainer
      center={[location.lat, location.lon]}
      zoom={13}
      style={{ height: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <ChangeMapView lat={location.lat} lon={location.lon} />
      <Circle
        center={[location.lat, location.lon]}
        radius={1000}
        pathOptions={{
          color: getAqiColor(aqi),
          fillColor: getAqiColor(aqi),
          fillOpacity: 0.5,
        }}
      >
        <Popup>AQI: {aqi}</Popup>
      </Circle>
    </MapContainer>
  );
}
