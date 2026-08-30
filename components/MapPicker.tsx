"use client";

import { useEffect, useRef } from "react";


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
  const mapContainerRef =
    useRef<HTMLDivElement | null>(null);

  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

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

    let map: any;

    async function initializeMap() {
      // Leaflet est chargé uniquement dans le navigateur
      const L = await import("leaflet");

      if (!mapContainerRef.current) {
        return;
      }

      if (mapRef.current) {
        return;
      }

      const defaultIcon = L.icon({
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

      const initialLatitude =
        latitude ?? 44.8378;

      const initialLongitude =
        longitude ?? -0.5792;

      map = L.map(
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

      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }
      ).addTo(map);

      if (
        latitude !== null &&
        longitude !== null
      ) {
        markerRef.current =
          L.marker([
            latitude,
            longitude,
          ])
            .addTo(map)
            .bindPopup(
              "📍 Emplacement sélectionné"
            )
            .openPopup();
      }

      map.on(
        "click",
        (event: any) => {
          const lat =
            event.latlng.lat;

          const lng =
            event.latlng.lng;

          if (markerRef.current) {
            markerRef.current.setLatLng([
              lat,
              lng,
            ]);
          } else {
            markerRef.current =
              L.marker([
                lat,
                lng,
              ])
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

      setTimeout(() => {
        if (map) {
          map.invalidateSize();
        }
      }, 100);
    }

    initializeMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;

    if (
      !map ||
      latitude === null ||
      longitude === null
    ) {
      return;
    }

    const position = [
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