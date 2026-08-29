import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function HomePage() {
  const { data: chats } = await supabase
    .from("chats")
    .select(
      "id, name, photo_url, location, statut, evacuation_incendie"
    )
    .order("created_at", { ascending: false })
    .limit(6);

  const recentChats = chats ?? [];

  return (
    <main className="min-h-screen bg-emerald-50">

      {/* HERO */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">

          <div className="rounded-3xl bg-white p-8 shadow-sm sm:p-12 lg:p-16">

            <div className="grid items-center gap-12 lg:grid-cols-2">

              <div>
                <div className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800">
                  🐾 Une communauté qui aide les chats
                </div>

                <h1 className="mt-6 text-4xl font-bold text-emerald-950 sm:text-5xl">
                  Aidons les chats perdus à
                  <span className="block text-emerald-600">
                    retrouver leur maison.
                  </span>
                </h1>

                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Signalez un chat perdu ou trouvé et partagez sa
                  localisation pour aider les propriétaires à retrouver
                  leur compagnon.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                  <Link
                    href="/signaler/perdu"
                    className="rounded-xl bg-emerald-600 px-6 py-4 text-center font-semibold text-white hover:bg-emerald-700"
                  >
                    🐱 Signaler un chat perdu
                  </Link>

                  <Link
                    href="/signaler/trouve"
                    className="rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-4 text-center font-semibold text-emerald-800 hover:bg-emerald-100"
                  >
                    🟢 Signaler un chat trouvé
                  </Link>

                </div>
              </div>

              <div className="flex justify-center">
                <div className="flex h-72 w-72 items-center justify-center rounded-full bg-emerald-100">
                  <div className="text-center">
                    <div className="text-8xl">🐱</div>
                    <p className="mt-4 font-semibold text-emerald-800">
                      Chaque signalement compte
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ACTIONS */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-6xl">

          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
              Comment aider ?
            </p>

            <h2 className="mt-2 text-3xl font-bold text-emerald-950">
              Quelques clics peuvent faire la différence
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">

            <Link
              href="/chats"
              className="rounded-2xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-3xl">
                🔴
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Chats perdus
              </h3>

              <p className="mt-3 text-gray-600">
                Consultez les chats actuellement recherchés.
              </p>

              <p className="mt-5 font-semibold text-emerald-600">
                Voir les chats perdus →
              </p>
            </Link>

            <Link
              href="/chats-trouves"
              className="rounded-2xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-3xl">
                🟢
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Chats trouvés
              </h3>

              <p className="mt-3 text-gray-600">
                Consultez les chats trouvés et aidez leur propriétaire.
              </p>

              <p className="mt-5 font-semibold text-emerald-600">
                Voir les chats trouvés →
              </p>
            </Link>

            <Link
              href="/carte"
              className="rounded-2xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-3xl">
                🗺️
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Carte
              </h3>

              <p className="mt-3 text-gray-600">
                Visualisez les signalements autour de vous.
              </p>

              <p className="mt-5 font-semibold text-emerald-600">
                Voir la carte →
              </p>
            </Link>

          </div>
        </div>
      </section>

      {/* INCENDIES */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-6xl">

          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-8">

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-3xl">
                🔥
              </div>

              <div className="flex-1">

                <h2 className="text-2xl font-bold text-orange-950">
                  Chats perdus lors d'une évacuation
                </h2>

                <p className="mt-2 text-orange-900/70">
                  Les évacuations peuvent entraîner la disparition
                  de nombreux animaux. Signalez rapidement votre chat
                  pour aider les recherches.
                </p>

              </div>

              <Link
                href="/signaler/perdu"
                className="rounded-xl bg-orange-600 px-5 py-3 text-center font-semibold text-white hover:bg-orange-700"
              >
                🔥 Signaler
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* DERNIERS SIGNALEMENTS */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                Derniers signalements
              </p>

              <h2 className="mt-2 text-3xl font-bold text-emerald-950">
                Les derniers chats signalés
              </h2>
            </div>

            <Link
              href="/chats"
              className="font-semibold text-emerald-700"
            >
              Voir tous les chats →
            </Link>

          </div>

          {recentChats.length === 0 ? (

            <div className="mt-8 rounded-2xl bg-white p-8 text-center shadow-sm">

              <div className="text-5xl">🐱</div>

              <p className="mt-4 font-medium text-gray-900">
                Aucun signalement pour le moment.
              </p>

              <p className="mt-2 text-gray-600">
                Soyez le premier à aider un chat.
              </p>

            </div>

          ) : (

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {recentChats.map((chat) => (

                <Link
                  key={chat.id}
                  href={`/chats/${chat.id}`}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >

                  {chat.photo_url ? (

                    <img
                      src={chat.photo_url}
                      alt={`Photo de ${chat.name || "chat"}`}
                      className="h-52 w-full object-cover"
                    />

                  ) : (

                    <div className="flex h-52 w-full items-center justify-center bg-emerald-50 text-7xl">
                      🐱
                    </div>

                  )}

                  <div className="p-6">

                    <div className="flex flex-wrap gap-2">

                      {chat.statut === "perdu" && (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
                          🔴 Perdu
                        </span>
                      )}

                      {chat.statut === "trouve" && (
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                          🟢 Trouvé
                        </span>
                      )}

                      {chat.statut === "retrouve" && (
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                          ✅ Retrouvé
                        </span>
                      )}

                      {chat.evacuation_incendie && (
                        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-800">
                          🔥 Évacuation
                        </span>
                      )}

                    </div>

                    <h3 className="mt-3 text-xl font-bold text-gray-900">
                      {chat.name || "Chat sans nom"}
                    </h3>

                    <p className="mt-2 text-sm text-gray-600">
                      📍 {chat.location || "Lieu non renseigné"}
                    </p>

                    <p className="mt-4 font-semibold text-emerald-600">
                      Voir la fiche →
                    </p>

                  </div>

                </Link>

              ))}

            </div>

          )}

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-emerald-100 bg-white px-6 py-10">

        <div className="mx-auto max-w-6xl">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="font-bold text-emerald-800">
                🐱 Chats Perdus
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Une communauté pour aider les chats à retrouver leur maison.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-sm font-medium text-emerald-700">

              <Link href="/">
                Accueil
              </Link>

              <Link href="/chats">
                Chats perdus
              </Link>

              <Link href="/chats-trouves">
                Chats trouvés
              </Link>

              <Link href="/carte">
                Carte
              </Link>

            </div>

          </div>

        </div>

      </footer>

    </main>
  );
}