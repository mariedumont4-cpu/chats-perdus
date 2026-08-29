import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function ChatsTrouvesPage() {
  const { data: chats, error } = await supabase
    .from("chats")
    .select("*")
    .eq("statut", "trouve")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-6xl">

          <Link
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-black"
          >
            ← Retour à l'accueil
          </Link>

          <h1 className="mt-8 text-4xl font-bold text-gray-900">
            🟢 Chats trouvés
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

        {/* Retour accueil */}
        <Link
          href="/"
          className="text-sm font-medium text-gray-600 hover:text-black"
        >
          ← Retour à l'accueil
        </Link>

        {/* Titre */}
        <div className="mt-8">

          <h1 className="text-4xl font-bold text-gray-900">
            🟢 Chats trouvés
          </h1>

          <p className="mt-3 text-gray-600">
            Retrouvez les signalements de chats qui ont été trouvés.
          </p>

        </div>

        {/* Aucun chat */}
        {!chats || chats.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-white p-8 shadow-sm">

            <p className="text-gray-600">
              Aucun chat trouvé n'a encore été signalé.
            </p>

            <Link
              href="/signaler/trouve"
              className="mt-5 inline-block rounded-xl bg-black px-5 py-3 font-medium text-white hover:bg-gray-800"
            >
              🐱 Signaler un chat trouvé
            </Link>

          </div>
        ) : (
          /* Liste des chats */
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {chats.map((chat) => (
              <Link
                key={chat.id}
                href={`/chats/${chat.id}`}
                className="block rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                {/* Photo */}
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

                {/* Statut */}
                <div className="mt-4">
                  <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                    🟢 Chat trouvé
                  </span>
                </div>

                {/* Nom */}
                <h2 className="mt-3 text-2xl font-semibold text-gray-900">
                  {chat.name || "Chat trouvé"}
                </h2>

                {/* Informations */}
                <div className="mt-4 space-y-2 text-gray-600">

                  <p>
                    <strong>Couleur :</strong>{" "}
                    {chat.color || "Non renseignée"}
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
                    {chat.location || "Non renseigné"}
                  </p>

                </div>

                {/* Description */}
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