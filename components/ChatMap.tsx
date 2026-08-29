"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Chat = {
  id: string;
  name: string;
  color: string;
  breed: string | null;
  location: string;
  lost_date: string;
  latitude?: number | string | null;
  longitude?: number | string | null;
  photo_url: string | null;
};

type ChatMapProps = {
  chats?: Chat[];
};

const markerIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function ChatMap({ chats = [] }: ChatMapProps) {
  const validChats = chats
    .map((chat) => ({
      ...chat,
      latitude: Number(chat.latitude),
      longitude: Number(chat.longitude),
    }))
    .filter(
      (chat) =>
        Number.isFinite(chat.latitude) &&
        Number.isFinite(chat.longitude)
    );

  const center: [number, number] =
    validChats.length > 0
      ? [
          validChats[0].latitude as number,
          validChats[0].longitude as number,
        ]
      : [44.8378, -0.5792];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200">
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={true}
        className="h-[600px] w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validChats.map((chat) => (
          <Marker
            key={chat.id}
            position={[
              chat.latitude as number,
              chat.longitude as number,
            ]}
            icon={markerIcon}
          >
            <Popup>
              <div className="w-48">
                {chat.photo_url && (
                  <img
                    src={chat.photo_url}
                    alt={`Photo de ${chat.name}`}
                    className="mb-3 h-32 w-full rounded-lg object-cover"
                  />
                )}

                <h3 className="font-bold text-gray-900">
                  🐱 {chat.name}
                </h3>

                <p className="mt-1 text-sm text-gray-600">
                  {chat.color}
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  📍 {chat.location}
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  📅 {chat.lost_date}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}