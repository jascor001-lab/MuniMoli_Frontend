"use client";

import { useMemo } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  CircleMarker,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MUNICIPAL_CONTACT } from "@/data/portal-data";

const { lat, lng, zoom } = MUNICIPAL_CONTACT.map;

function createMunicipalIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="
      width: 36px;
      height: 36px;
      border-radius: 9999px;
      background: #064e3b;
      border: 3px solid #ffffff;
      box-shadow: 0 6px 16px rgba(6, 78, 59, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" fill="#34d399"/>
        <circle cx="12" cy="10" r="2.5" fill="#064e3b"/>
      </svg>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -34],
  });
}

export function MunicipalityMap() {
  const icon = useMemo(() => createMunicipalIcon(), []);
  const osmDirections = `https://www.openstreetmap.org/directions?from=&to=${lat}%2C${lng}#map=${zoom}/${lat}/${lng}`;
  const osmPlace = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="ubicacion-heading"
            className="text-xl font-bold text-molina-deep"
          >
            Ubicación
          </h2>
          <p className="mt-1 text-sm text-molina-muted">
            Sede central — {MUNICIPAL_CONTACT.address}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={osmPlace}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-molina-deep px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-molina-teal"
          >
            Ver en OpenStreetMap
          </a>
          <a
            href={osmDirections}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-molina-deep transition-colors hover:bg-emerald-50"
          >
            Cómo llegar
          </a>
        </div>
      </div>

      <div className="relative z-0 h-[320px] w-full sm:h-[380px] lg:h-[420px]">
        <MapContainer
          center={[lat, lng]}
          zoom={zoom}
          scrollWheelZoom={false}
          className="z-0 h-full w-full"
          aria-label="Mapa de la sede municipal de La Molina"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <CircleMarker
            center={[lat, lng]}
            radius={18}
            pathOptions={{
              color: "#10b981",
              fillColor: "#10b981",
              fillOpacity: 0.15,
              weight: 1,
            }}
          />
          <Marker position={[lat, lng]} icon={icon}>
            <Popup>
              <strong>Municipalidad Distrital de La Molina</strong>
              <br />
              {MUNICIPAL_CONTACT.address}
              <br />
              Central: {MUNICIPAL_CONTACT.phone}
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      <p className="border-t border-slate-100 px-5 py-2.5 text-[11px] text-molina-muted">
        Mapa libre con Leaflet y teselas de OpenStreetMap (sin API de pago).
      </p>
    </div>
  );
}
