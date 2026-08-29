
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function ChatsPage() {
  const { data: chats, error } = await supabase
  .from("chats")
  .select("*")
  .eq("statut", "perdu")
  .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold text-gray-900">
            🐱 Chats perdus
          </h1>

          <p className="mt-6 text-red-600">
            Impossible de récupérer les signalements.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-4xl font-bold text-gray-900">
          🐱 Chats perdus
        </h1>

        <p className="mt-3 text-gray-600">
          Retrouvez les signalements de chats actuellement recherchés.
        </p>

        {chats.length === 0 ? (
          <p className="mt-10 text-gray-600">
            Aucun signalement pour le moment.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {chats.map((chat) => (
              <Link
  key={chat.id}
  href={`/chats/${chat.id}`}
  className="block rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
>
                {chat.photo_url ? (
  <img
    src={chat.photo_url}
    alt={`Photo de ${chat.name}`}
    className="h-56 w-full rounded-xl object-cover"
  />
) : (
  <div className="flex h-56 w-full items-center justify-center rounded-xl bg-gray-100 text-6xl">
    🐱
  </div>
)}

                <h2 className="mt-4 text-2xl font-semibold text-gray-900">
                  {chat.name}
                </h2>

                <div className="mt-4 space-y-2 text-gray-600">
                  <p>
                    <strong>Couleur :</strong>{" "}
                    {chat.color}
                  </p>

                  <p>
                    <strong>Race :</strong>{" "}
                    {chat.breed || "Non renseignée"}
                  </p>

                  <p>
                    <strong>Sexe :</strong>{" "}
                    {chat.sex || "Non renseigné"}
                  </p>

                  <p>
                    <strong>📍 Lieu :</strong>{" "}
                    {chat.location}
                  </p>

                  <p>
                    <strong>📅 Disparu le :</strong>{" "}
                    {chat.lost_date}
                  </p>
                </div>

                {chat.description && (
                  <p className="mt-4 border-t pt-4 text-gray-600">
                    {chat.description}
                  </p>
                )}
              </Link>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}