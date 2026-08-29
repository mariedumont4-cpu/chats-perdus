"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  chatId: string;
  evacuationIncendie: boolean;
};

export default function FireEvacuationButton({
  chatId,
  evacuationIncendie,
}: Props) {
  const [isEvacuation, setIsEvacuation] = useState(
    evacuationIncendie
  );
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);

    const newValue = !isEvacuation;

    const { error } = await supabase
      .from("chats")
      .update({
        evacuation_incendie: newValue,
      })
      .eq("id", chatId);

    if (error) {
      console.error("Erreur Supabase :", error);
      alert("Impossible de modifier le signalement.");
      setLoading(false);
      return;
    }

    setIsEvacuation(newValue);
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`w-full rounded-xl px-5 py-4 font-medium transition ${
        isEvacuation
          ? "bg-orange-100 text-orange-800 hover:bg-orange-200"
          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
      }`}
    >
      {loading
        ? "Enregistrement..."
        : isEvacuation
        ? "🔥 Signalement lié à une évacuation incendie"
        : "🔥 Signaler une perte lors d'une évacuation incendie"}
    </button>
  );
}