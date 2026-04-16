import React from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { getMarkerColor } from "../services/mapThresholdService";
import { NeighborhoodPopup } from "./NeighborhoodPopup";
import "leaflet/dist/leaflet.css";

export const MapView = ({ mapData, thresholds }) => (
  <div className="card border-0 shadow-sm">
    <div className="card-body p-0" style={{ height: "500px" }}>
      <MapContainer
        center={[29.88, -97.94]}
        zoom={10}
        style={{ height: "100%", width: "100%", borderRadius: "0.375rem" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mapData.map((n) => (
          <CircleMarker
            key={n.neighborhood_id}
            center={[n.latitude, n.longitude]}
            radius={Math.max(8, Math.min(20, (n.households || 100) / 40))}
            fillColor={getMarkerColor(n.efficiency, thresholds)}
            color="#fff"
            weight={2}
            fillOpacity={0.8}
          >
            <Popup>
              <NeighborhoodPopup neighborhood={n} thresholds={thresholds} />
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  </div>
);
