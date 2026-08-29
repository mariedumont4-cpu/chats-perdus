"use client";

import dynamic from "next/dynamic";

const ChatMap = dynamic(
  () => import("@/components/ChatMap"),
  { ssr: false }
);

type ChatDetailMapProps = {
  id: string;
  name: string;
  color: string;
  breed: string | null;
  location: string;
  lost_date: string;
  latitude: number;
  longitude: number;
  photo_url: string | null;
};

export default function ChatDetailMap({
  id,
  name,
  color,
  breed,
  location,
  lost_date,
  latitude,
  longitude,
  photo_url,
}: ChatDetailMapProps) {
  return (
    <ChatMap
      chats={[
        {
          id,
          name,
          color,
          breed,
          location,
          lost_date,
          latitude,
          longitude,
          photo_url,
        },
      ]}
    />
  );
}