import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

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

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">

          <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

            <div className="grid items-center lg:grid-cols-2">

              {/* TEXTE */}

              <div className="p-8 sm:p-12 lg:p-16">

                <div className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800">
                  🐾 Une communauté qui aide les chats
                </div>

                <h1 className="mt-6 text-4xl font-bold tracking-tight text-emerald-950 sm:text-5xl lg:text-6xl">
                  Aidons les chats perdus à
                  <span className="mt-2 block text-emerald-600">
                    retrouver leur maison.
                  </span>
                </h1>

                <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
                  Signalez un chat perdu ou trouvé et partagez sa
                  localisation pour aider les propriétaires à retrouver
                  leur compagnon.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                  <Link
                    href="/signaler/perdu"
                    className="rounded-xl bg-emerald-600 px-6 py-4 text-center font-semibold text-white transition hover:bg-emerald-700"
                  >
                    🐱 Signaler un chat perdu
                  </Link>

                  <Link
                    href="/signaler/trouve"
                    className="rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-4 text-center font-semibold text-emerald-800 transition hover:bg-emerald-100"
                  >
                    🟢 Signaler un chat trouvé
                  </Link>

                </div>

              </div>

              {/* ILLUSTRATION */}

              <div className="flex min-h-[360px] items-center justify-center bg-emerald-100 p-10">

                <div className="text-center">

                  <div className="mx-auto flex h-56 w-56 items-center justify-center rounded-full bg-white shadow-sm">
                    <span className="text-8xl">
                      🐱
                    </span>
                  </div>

                  <p className="mt-6 text-lg font-bold text-emerald-900">
                    Chaque signalement compte
                  </p>

                  <p className="mt-2 text-sm text-emerald-800">
                    Ensemble, aidons-les à rentrer chez eux.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          ACTIONS
      ===================================================== */}

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

            {/* CHATS PERDUS */}

            <Link
              href="/chats"
              className="group rounded-2xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
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

              <p className="mt-5 font-semibold text-emerald-600 transition group-hover:text-emerald-700">
                Voir les chats perdus →
              </p>

            </Link>


            {/* CHATS TROUVÉS */}

            <Link
              href="/chats-trouves"
              className="group rounded-2xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
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

              <p className="mt-5 font-semibold text-emerald-600 transition group-hover:text-emerald-700">
                Voir les chats trouvés →
              </p>

            </Link>


            {/* CARTE */}

            <Link
              href="/carte"
              className="group rounded-2xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
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

              <p className="mt-5 font-semibold text-emerald-600 transition group-hover:text-emerald-700">
                Voir la carte →
              </p>

            </Link>

          </div>

        </div>
      </section>


      {/* =====================================================
          ALERTE INCENDIES
      ===================================================== */}

      <section className="px-6 pb-16">

        <div className="mx-auto max-w-6xl">

          <div className="overflow-hidden rounded-3xl border border-orange-300 bg-gradient-to-r from-orange-100 to-red-50 shadow-sm">

            <div className="p-8 sm:p-10">

              <div className="flex flex-col gap-8 lg:flex-row lg:items-center">

                {/* ICÔNE */}

                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-orange-200 text-4xl shadow-sm">
                  🔥
                </div>

                {/* TEXTE */}

                <div className="flex-1">

                  <div className="inline-flex rounded-full bg-orange-200 px-3 py-1 text-xs font-bold uppercase tracking-wide text-orange-900">
                    Situation particulière
                  </div>

                  <h2 className="mt-3 text-2xl font-bold text-orange-950 sm:text-3xl">
                    Chats perdus lors d'une évacuation
                  </h2>

                  <p className="mt-3 max-w-3xl leading-7 text-orange-900">
                    Les évacuations liées aux incendies peuvent entraîner
                    la disparition de nombreux animaux. Signalez rapidement
                    votre chat afin de faciliter les recherches.
                  </p>

                </div>

                {/* BOUTON */}

                <Link
                  href="/signaler/perdu"
                  className="shrink-0 rounded-xl bg-orange-600 px-6 py-4 text-center font-bold text-white shadow-sm transition hover:bg-orange-700"
                >
                  🔥 Signaler un chat
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          DERNIERS SIGNALEMENTS
      ===================================================== */}

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
              className="font-semibold text-emerald-700 hover:text-emerald-900"
            >
              Voir tous les chats →
            </Link>

          </div>


          {/* AUCUN SIGNALEMENT */}

          {recentChats.length === 0 ? (

            <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-sm">

              <div className="text-6xl">
                🐱
              </div>

              <p className="mt-5 font-semibold text-gray-900">
                Aucun signalement pour le moment.
              </p>

              <p className="mt-2 text-gray-600">
                Soyez le premier à aider un chat.
              </p>

            </div>

          ) : (

            /* CARTES */

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {recentChats.map((chat) => {

                const isEvacuation =
                  chat.statut === "perdu" &&
                  chat.evacuation_incendie === true;

                return (

                  <Link
                    key={chat.id}
                    href={`/chats/${chat.id}`}
                    className={`
                      group overflow-hidden rounded-2xl shadow-sm transition
                      hover:-translate-y-1 hover:shadow-lg
                      ${
                        isEvacuation
                          ? "border-2 border-orange-400 bg-orange-50"
                          : "bg-white"
                      }
                    `}
                  >

                    {/* PHOTO */}

                    <div className="relative">

                      {chat.photo_url ? (

                        <img
                          src={chat.photo_url}
                          alt={`Photo de ${chat.name || "chat"}`}
                          className="h-52 w-full object-cover"
                        />

                      ) : (

                        <div
                          className={`
                            flex h-52 w-full items-center justify-center text-7xl
                            ${
                              isEvacuation
                                ? "bg-orange-100"
                                : "bg-emerald-50"
                            }
                          `}
                        >
                          🐱
                        </div>

                      )}

                      {/* BADGE INCENDIE */}

                      {isEvacuation && (

                        <div className="absolute left-4 top-4">

                          <span className="rounded-full bg-orange-600 px-3 py-2 text-xs font-bold text-white shadow-md">
                            🔥 ÉVACUATION INCENDIE
                          </span>

                        </div>

                      )}

                    </div>


                    {/* CONTENU */}

                    <div className="p-6">

                      {/* STATUT */}

                      <div className="flex flex-wrap gap-2">

                        {chat.statut === "perdu" && !isEvacuation && (

                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
                            🔴 Chat perdu
                          </span>

                        )}

                        {chat.statut === "perdu" && isEvacuation && (

                          <span className="rounded-full bg-orange-200 px-3 py-1 text-xs font-bold text-orange-900">
                            🔥 Perdu lors d'une évacuation
                          </span>

                        )}

                        {chat.statut === "trouve" && (

                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                            🟢 Chat trouvé
                          </span>

                        )}

                        {chat.statut === "retrouve" && (

                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                            ✅ Chat retrouvé
                          </span>

                        )}

                      </div>


                      {/* NOM */}

                      <h3
                        className={`
                          mt-3 text-xl font-bold
                          ${
                            isEvacuation
                              ? "text-orange-950"
                              : "text-gray-900"
                          }
                        `}
                      >
                        {chat.name || "Chat sans nom"}
                      </h3>


                      {/* LIEU */}

                      <p
                        className={`
                          mt-2 text-sm
                          ${
                            isEvacuation
                              ? "text-orange-900"
                              : "text-gray-600"
                          }
                        `}
                      >
                        📍 {chat.location || "Lieu non renseigné"}
                      </p>


                      {/* MESSAGE SPÉCIAL */}

                      {isEvacuation && (

                        <div className="mt-4 rounded-xl border border-orange-200 bg-orange-100 p-3">

                          <p className="text-sm font-semibold text-orange-900">
                            🔥 Ce chat a été perdu lors d'une évacuation.
                          </p>

                          <p className="mt-1 text-xs leading-5 text-orange-800">
                            Une attention particulière est portée à ce
                            signalement.
                          </p>

                        </div>

                      )}


                      {/* LIEN */}

                      <p
                        className={`
                          mt-5 font-semibold
                          ${
                            isEvacuation
                              ? "text-orange-700"
                              : "text-emerald-600"
                          }
                        `}
                      >
                        Voir la fiche →
                      </p>

                    </div>

                  </Link>

                );

              })}

            </div>

          )}

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-emerald-100 bg-white px-6 py-10">

        <div className="mx-auto max-w-6xl">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="font-bold text-emerald-800">
                🐱 Chats Perdus
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Une communauté pour aider les chats à retrouver leur maison.
              </p>

            </div>


            <div className="flex flex-wrap gap-5 text-sm font-medium text-emerald-700">

              <Link
                href="/"
                className="hover:text-emerald-900"
              >
                Accueil
              </Link>

              <Link
                href="/chats"
                className="hover:text-emerald-900"
              >
                Chats perdus
              </Link>

              <Link
                href="/chats-trouves"
                className="hover:text-emerald-900"
              >
                Chats trouvés
              </Link>

              <Link
                href="/carte"
                className="hover:text-emerald-900"
              >
                Carte
              </Link>

            </div>

          </div>

        </div>

      </footer>

    </main>
  );
}