import { supabase } from "@/lib/supabase";
import CarteClient from "@/components/CarteClient";

export default async function CartePage() {
  const { data: chats, error } = await supabase
    .from("chats")
    .select("*")
    .not("latitude", "is", null)
    .not("longitude", "is", null)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold text-gray-900">
            🗺️ Carte des chats
          </h1>

          <p className="mt-6 text-red-600">
            Impossible de récupérer les signalements.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-900">
          🗺️ Carte des chats
        </h1>

        <p className="mt-3 text-gray-600">
          Retrouvez les signalements de chats sur la carte.
        </p>

        {!chats || chats.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-gray-600">
              Aucun signalement avec une position sur la carte.
            </p>
          </div>
        ) : (
          <div className="mt-8">
            <CarteClient chats={chats} />
          </div>
        )}
      </div>
    </main>
  );
}