import Link from "next/link";
import { supabase } from "@/lib/supabase";

import ChatDetailMap from "@/components/ChatDetailMap";
import ChatFoundButton from "@/components/ChatFoundButton";
import ContactOwnerButton from "@/components/ContactOwnerButton";
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

  // =========================
  // CHAT INTROUVABLE
  // =========================

  if (error || !chat) {
    return (
      <main className="min-h-screen bg-emerald-50 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/chats"
            className="text-sm font-medium text-emerald-700 hover:text-emerald-900"
          >
            ← Retour aux chats perdus
          </Link>

          <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900">
              Chat introuvable
            </h1>

            <p className="mt-3 text-gray-600">
              Ce signalement n'existe pas ou n'est plus disponible.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // =========================
  // LOCALISATION
  // =========================

  const hasLocation =
    chat.latitude !== null &&
    chat.longitude !== null &&
    Number.isFinite(Number(chat.latitude)) &&
    Number.isFinite(Number(chat.longitude));

  // =========================
  // PAGE
  // =========================

  return (
    <main className="min-h-screen bg-emerald-50 px-6 py-16">
      <div className="mx-auto max-w-3xl">

        {/* =========================
            RETOUR
        ========================= */}

        <Link
          href="/chats"
          className="text-sm font-medium text-emerald-700 hover:text-emerald-900"
        >
          ← Retour aux chats perdus
        </Link>

        {/* =========================
            FICHE DU CHAT
        ========================= */}

        <article className="mt-8 overflow-hidden rounded-2xl bg-white p-8 shadow-sm">

          {/* =========================
              PHOTO
          ========================= */}

          {chat.photo_url ? (
            <img
              src={chat.photo_url}
              alt={`Photo de ${chat.name}`}
              className="h-96 w-full rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-96 w-full items-center justify-center rounded-2xl bg-emerald-50 text-8xl">
              🐱
            </div>
          )}

          {/* =========================
              STATUT
          ========================= */}

          <div className="mt-6">
            {chat.statut === "perdu" ? (
              <span className="inline-flex rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-800">
                🔴 Chat perdu
              </span>
            ) : chat.statut === "trouve" ? (
              <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800">
                🟢 Chat trouvé
              </span>
            ) : chat.statut === "retrouve" ? (
              <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800">
                ✅ Chat retrouvé
              </span>
            ) : (
              <span className="inline-flex rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
                Statut inconnu
              </span>
            )}
          </div>

          {/* =========================
              NOM
          ========================= */}

          <h1 className="mt-6 text-4xl font-bold text-gray-900">
            {chat.name}
          </h1>

          {/* =========================
              INFORMATIONS
          ========================= */}

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
              {chat.sex === "male"
                ? "Mâle"
                : chat.sex === "female"
                ? "Femelle"
                : chat.sex === "unknown"
                ? "Je ne sais pas"
                : "Non renseigné"}
            </p>

            <p>
              <strong>📍 Lieu de disparition :</strong>{" "}
              {chat.location || "Non renseigné"}
            </p>

            <p>
              <strong>📅 Date de disparition :</strong>{" "}
              {chat.lost_date || "Non renseignée"}
            </p>

          </div>

          {/* =========================
              LOCALISATION
          ========================= */}

          {hasLocation && (
            <div className="mt-8 border-t pt-6">

              <h2 className="text-xl font-semibold text-gray-900">
                📍 Localisation
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Localisation indiquée lors du signalement.
              </p>

              <div className="mt-4 overflow-hidden rounded-2xl">
                <ChatDetailMap
                  id={chat.id}
                  name={chat.name}
                  color={chat.color}
                  breed={chat.breed}
                  location={chat.location}
                  lost_date={chat.lost_date}
                  latitude={Number(chat.latitude)}
                  longitude={Number(chat.longitude)}
                  photo_url={chat.photo_url}
                />
              </div>

            </div>
          )}

          {/* =========================
              DESCRIPTION
          ========================= */}

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

          {/* =========================
              CONTACT PROPRIÉTAIRE
          ========================= */}

          {chat.statut === "perdu" && chat.contact_email && (
            <div className="mt-8 border-t pt-6">

              <ContactOwnerButton
                email={chat.contact_email}
                chatName={chat.name}
              />

            </div>
          )}

          {/* =========================
              CHAT RETROUVÉ
          ========================= */}

          {chat.statut === "perdu" && (
            <div className="mt-4">

              <ChatFoundButton
                chatId={chat.id}
              />

            </div>
          )}

          {/* =========================
              ÉVACUATION INCENDIE
          ========================= */}

          {chat.statut === "perdu" && (
            <div className="mt-4">

              <FireEvacuationButton
                chatId={chat.id}
                evacuationIncendie={
                  chat.evacuation_incendie ?? false
                }
              />

            </div>
          )}

          {/* =========================
              INFORMATION
          ========================= */}

          {chat.statut === "perdu" && (
            <div className="mt-8 rounded-xl bg-emerald-50 p-5">

              <p className="font-medium text-gray-900">
                🐾 Vous avez vu ce chat ?
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Si vous pensez avoir aperçu ce chat,
                vous pouvez contacter directement la personne
                qui a publié le signalement.
              </p>

            </div>
          )}

        </article>

        {/* =========================
            RETOUR À LA LISTE
        ========================= */}

        <div className="mt-8 text-center">

          <Link
            href="/chats"
            className="inline-flex rounded-xl bg-white px-6 py-3 font-medium text-emerald-700 shadow-sm transition hover:bg-emerald-100"
          >
            ← Voir tous les chats perdus
          </Link>

        </div>

      </div>
    </main>
  );
}