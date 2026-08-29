import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ChatDetailMap from "@/components/ChatDetailMap";
import ChatFoundButton from "@/components/ChatFoundButton";
import FireEvacuationButton from "@/components/FireEvacuationButton";

export default async function ChatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: chat, error } = await supabase
    .from("chats")
    .select("*")
    .eq("id", id)
    .single();

  // Chat introuvable
  if (error || !chat) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/chats"
            className="text-sm font-medium text-gray-600 hover:text-black"
          >
            ← Retour aux chats perdus
          </Link>

          <h1 className="mt-8 text-3xl font-bold text-gray-900">
            Chat introuvable
          </h1>

          <p className="mt-3 text-gray-600">
            Ce signalement n'existe pas ou n'est plus disponible.
          </p>
        </div>
      </main>
    );
  }

  // Vérification des coordonnées
  const latitude = Number(chat.latitude);
  const longitude = Number(chat.longitude);

  const hasLocation =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);

  // Statut
  const statut = chat.statut || "perdu";

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-3xl">

        {/* Retour */}
        <Link
          href="/chats"
          className="text-sm font-medium text-gray-600 hover:text-black"
        >
          ← Retour aux chats perdus
        </Link>

        {/* Fiche */}
        <article className="mt-8 rounded-2xl bg-white p-8 shadow-sm">

          {/* Photo */}
          {chat.photo_url ? (
            <img
              src={chat.photo_url}
              alt={`Photo de ${chat.name}`}
              className="h-96 w-full rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-96 w-full items-center justify-center rounded-2xl bg-gray-100 text-8xl">
              🐱
            </div>
          )}

          {/* Statut */}
          <div className="mt-6">
            {statut === "perdu" && (
              <span className="inline-flex rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-800">
                🔴 Chat perdu
              </span>
            )}

            {statut === "trouve" && (
              <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800">
                🟢 Chat trouvé
              </span>
            )}

            {statut === "retrouve" && (
              <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800">
                ✅ Chat retrouvé
              </span>
            )}

            {!["perdu", "trouve", "retrouve"].includes(statut) && (
              <span className="inline-flex rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
                Statut inconnu
              </span>
            )}
          </div>

          {/* Nom */}
          <h1 className="mt-6 text-4xl font-bold text-gray-900">
            {chat.name}
          </h1>

          {/* Informations */}
          <div className="mt-8 space-y-4 text-gray-700">

            <p>
              <strong>Couleur / robe :</strong>{" "}
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

            <p>
              <strong>📅 Date de disparition :</strong>{" "}
              {chat.lost_date || "Non renseignée"}
            </p>

          </div>

          {/* Carte */}
          {hasLocation && (
            <div className="mt-8 border-t pt-6">

              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                📍 Localisation
              </h2>

              <ChatDetailMap
                id={chat.id}
                name={chat.name}
                color={chat.color}
                breed={chat.breed}
                location={chat.location}
                lost_date={chat.lost_date}
                latitude={latitude}
                longitude={longitude}
                photo_url={chat.photo_url}
              />

            </div>
          )}

          {/* Description */}
          {chat.description && (
            <div className="mt-8 border-t pt-6">

              <h2 className="text-xl font-semibold text-gray-900">
                Description
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                {chat.description}
              </p>

            </div>
          )}

          {/* Actions */}
          {statut === "perdu" && (
            <div className="mt-8 border-t pt-6">

              <h2 className="text-xl font-semibold text-gray-900">
                Que souhaitez-vous signaler ?
              </h2>

              <div className="mt-4 space-y-4">

                {/* Chat retrouvé */}
                <ChatFoundButton
                  chatId={chat.id}
                />

                {/* Évacuation incendie */}
                <FireEvacuationButton
                  chatId={chat.id}
                  evacuationIncendie={
                    chat.evacuation_incendie ?? false
                  }
                />

              </div>

            </div>
          )}

          {/* Information */}
          <div className="mt-8 rounded-xl bg-gray-50 p-5">

            <p className="font-medium text-gray-900">
              Vous avez vu ce chat ?
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Si vous avez retrouvé ce chat ou si vous disposez
              d'une information importante, utilisez les boutons
              ci-dessus pour mettre à jour le signalement.
            </p>

          </div>

        </article>

      </div>
    </main>
  );
}