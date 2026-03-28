import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.mergeOptions({ icon: defaultIcon });

function FitBounds({ positions }) {
  const map = useMap();
  const done = useRef(false);

  useEffect(() => {
    if (!positions?.length || done.current) return;
    const b = L.latLngBounds(positions);
    map.fitBounds(b, { padding: [48, 48], maxZoom: 15 });
    done.current = true;
  }, [map, positions]);

  return null;
}

export default function LiveMap({
  height = 380,
  clientLatLng = [12.9716, 77.5946],
  professionalLatLng = [12.962, 77.582],
  showServiceArea = true,
  serviceRadiusM = 900,
}) {
  const positions =
    professionalLatLng && clientLatLng
      ? [clientLatLng, professionalLatLng]
      : [clientLatLng];

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-inner"
      style={{ height }}
    >
      <div className="absolute left-3 top-3 z-[500] rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-[#1E3A8A] shadow">
        ● Live · OpenStreetMap
      </div>
      <MapContainer
        center={clientLatLng}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {showServiceArea && (
          <Circle
            center={clientLatLng}
            radius={serviceRadiusM}
            pathOptions={{
              color: "#1e3a8a",
              weight: 2,
              fillColor: "#1e3a8a",
              fillOpacity: 0.06,
            }}
          />
        )}
        <FitBounds positions={positions} />
        <Marker position={clientLatLng}>
          <Popup>
            <strong>You</strong>
            <br />
            Service location
          </Popup>
        </Marker>
        {professionalLatLng && (
          <Marker position={professionalLatLng}>
            <Popup>
              <strong>Professional</strong>
              <br />
              Approaching your location
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
