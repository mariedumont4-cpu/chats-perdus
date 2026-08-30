
"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type MapPickerProps = {
  latitude: number | null;
  longitude: number | null;
  onPositionChange: (
    latitude: number,
    longitude: number
  ) => void;
};

export default function MapPicker({
  latitude,
  longitude,
  onPositionChange,
}: MapPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(
    null
  );

  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const onPositionChangeRef =
    useRef(onPositionChange);

  useEffect(() => {
    onPositionChangeRef.current =
      onPositionChange;
  }, [onPositionChange]);

  useEffect(() => {
    if (!mapContainerRef.current) {
      return;
    }

    if (mapRef.current) {
      return;
    }

    // Icône Leaflet
    const defaultIcon =
      L.icon({
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

    L.Marker.prototype.options.icon =
      defaultIcon;

    // Position initiale :
    // Bordeaux par défaut
    const initialLatitude =
      latitude ?? 44.8378;

    const initialLongitude =
      longitude ?? -0.5792;

    const map = L.map(
      mapContainerRef.current
    ).setView(
      [
        initialLatitude,
        initialLongitude,
      ],
      latitude !== null &&
      longitude !== null
        ? 14
        : 12
    );

    mapRef.current = map;

    // Fond OpenStreetMap
    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }
    ).addTo(map);

    // Marqueur initial
    if (
      latitude !== null &&
      longitude !== null
    ) {
      markerRef.current =
        L.marker(
          [
            latitude,
            longitude,
          ]
        )
          .addTo(map)
          .bindPopup(
            "📍 Emplacement sélectionné"
          )
          .openPopup();
    }

    // Clic sur la carte
    map.on(
      "click",
      (event: L.LeafletMouseEvent) => {
        const lat =
          event.latlng.lat;

        const lng =
          event.latlng.lng;

        if (markerRef.current) {
          markerRef.current.setLatLng(
            [lat, lng]
          );
        } else {
          markerRef.current =
            L.marker([lat, lng])
              .addTo(map)
              .bindPopup(
                "📍 Emplacement sélectionné"
              )
              .openPopup();
        }

        onPositionChangeRef.current(
          lat,
          lng
        );
      }
    );

    // Correction du rendu lorsque la carte
    // apparaît après le chargement du composant
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Lorsque la ville sélectionnée change,
  // déplacer la carte et le marqueur.
  useEffect(() => {
    const map = mapRef.current;

    if (
      !map ||
      latitude === null ||
      longitude === null
    ) {
      return;
    }

    const position: L.LatLngExpression = [
      latitude,
      longitude,
    ];

    map.setView(
      position,
      14,
      {
        animate: true,
      }
    );

    if (markerRef.current) {
      markerRef.current.setLatLng(
        position
      );
    } else {
      markerRef.current =
        L.marker(position)
          .addTo(map)
          .bindPopup(
            "📍 Emplacement sélectionné"
          )
          .openPopup();
    }

    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [latitude, longitude]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-400 bg-white">
      <div
        ref={mapContainerRef}
        className="h-[350px] w-full"
      />

      <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900">
        📍 Cliquez directement sur la carte
        pour choisir l'emplacement du chat.
      </div>
    </div>
  );
}

