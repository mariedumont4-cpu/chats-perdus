"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type ChatFoundButtonProps = {
  chatId: string;
};

export default function ChatFoundButton({
  chatId,
}: ChatFoundButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleFound() {
    const confirmed = window.confirm(
      "Confirmez-vous que ce chat a été retrouvé ?"
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase
      .from("chats")
      .update({
        statut: "retrouve",
      })
      .eq("id", chatId);

    if (error) {
      console.error("Erreur Supabase :", error);

      setMessage(
        "Impossible de modifier le statut du chat."
      );

      setLoading(false);
      return;
    }

    setMessage(
      "✅ Le chat a été marqué comme retrouvé."
    );

    setLoading(false);
  }

  return (
    <div className="mt-8 rounded-2xl bg-green-50 p-6">
      <h2 className="text-xl font-semibold text-gray-900">
        Bonne nouvelle ?
      </h2>

      <p className="mt-2 text-gray-600">
        Votre chat a été retrouvé ?
        Mettez à jour son signalement.
      </p>

      <button
        type="button"
        onClick={handleFound}
        disabled={loading}
        className="mt-4 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Mise à jour..."
          : "✅ Mon chat a été retrouvé"}
      </button>

      {message && (
        <p className="mt-4 font-medium text-green-800">
          {message}
        </p>
      )}
    </div>
  );
}