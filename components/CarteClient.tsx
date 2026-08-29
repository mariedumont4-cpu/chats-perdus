"use client";

import dynamic from "next/dynamic";

const ChatMap = dynamic(
  () => import("@/components/ChatMap"),
  { ssr: false }
);

export default function CarteClient({ chats }: any) {
  return <ChatMap chats={chats} />;
}