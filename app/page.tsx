import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { data: chats, error } = await supabase
    .from("chats")
    .select(
      "id, name, photo_url, location, statut, evacuation_incendie, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(6);

  const recentChats = chats ?? [];

  return (
    <main className="min-h-screen bg-[#f6fbf8] text-gray-900">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden">

        {/* Décor */}
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-emerald-100 opacity-60 blur-3xl" />
        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-green-100 opacity-60 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-10 lg:pb-28 lg:pt-16">

          {/* Petite navigation */}
          <div className="mb-10 flex items-center justify-between">

            <Link
              href="/"
              className="text-xl font-extrabold tracking-tight text-emerald-900"
            >
              🐾 Chats Perdus
            </Link>

            <Link
              href="/carte"
              className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-50"
            >
              🗺️ Voir la carte
            </Link>

          </div>

          <div className="grid items-center gap-14 lg:grid-cols-2">

            {/* TEXTE */}

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm">
                <span>🐾</span>
                <span>Une communauté qui aide les chats</span>
              </div>

              <h1 className="mt-7 max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-tight text-emerald-950 sm:text-6xl">
                Aidons les chats à
                <span className="mt-2 block text-emerald-600">
                  retrouver leur maison.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-gray-600">
                Vous avez perdu votre chat ? Vous en avez trouvé un ?
                Signalez-le simplement pour permettre à la communauté
                d'agir rapidement.
              </p>

              {/* BOUTONS */}

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">

                <Link
                  href="/signaler/perdu"
                  className="group rounded-2xl bg-emerald-600 px-6 py-4 text-center font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700"
                >
                  🐱 Signaler un chat perdu
                  <span className="ml-2 transition group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  href="/signaler/trouve"
                  className="rounded-2xl border border-emerald-200 bg-white px-6 py-4 text-center font-bold text-emerald-800 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50"
                >
                  🟢 J'ai trouvé un chat
                </Link>

              </div>

              {/* MINI INFOS */}

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-500">

                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    ✓
                  </span>
                  Signalement simple
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    ✓
                  </span>
                  Carte des signalements
                </div>

              </div>

            </div>

            {/* VISUEL */}

            <div className="relative flex justify-center">

              <div className="relative flex h-[330px] w-[330px] items-center justify-center rounded-[40%] bg-emerald-100 shadow-inner sm:h-[390px] sm:w-[390px]">

                <div className="absolute inset-6 rounded-[38%] border border-emerald-200" />

                <div className="relative text-center">

                  <div className="text-9xl drop-shadow-sm">
                    🐱
                  </div>

                  <div className="mt-5 rounded-2xl bg-white px-6 py-4 shadow-lg">

                    <p className="font-bold text-emerald-900">
                      Chaque signalement compte
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Ensemble, retrouvons-les.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          ACTIONS
      ====================================================== */}

      <section className="px-6 pb-20">

        <div className="mx-auto max-w-7xl">

          <div className="mb-10 max-w-2xl">

            <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">
              Comment aider ?
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-emerald-950 sm:text-4xl">
              Quelques clics peuvent faire la différence.
            </h2>

          </div>

          <div className="grid gap-5 md:grid-cols-3">

            {/* PERDUS */}

            <Link
              href="/chats"
              className="group rounded-3xl border border-red-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-3xl">
                🔴
              </div>

              <h3 className="mt-6 text-xl font-bold text-gray-900">
                Chats perdus
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Consultez les chats actuellement recherchés
                et ouvrez leur fiche pour obtenir davantage
                d'informations.
              </p>

              <div className="mt-6 font-bold text-red-600 transition group-hover:translate-x-1">
                Voir les chats perdus →
              </div>

            </Link>

            {/* TROUVÉS */}

            <Link
              href="/chats-trouves"
              className="group rounded-3xl border border-emerald-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-3xl">
                🟢
              </div>

              <h3 className="mt-6 text-xl font-bold text-gray-900">
                Chats trouvés
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Vous avez trouvé un chat ? Consultez les
                signalements et aidez-le à retrouver son
                propriétaire.
              </p>

              <div className="mt-6 font-bold text-emerald-600 transition group-hover:translate-x-1">
                Voir les chats trouvés →
              </div>

            </Link>

            {/* CARTE */}

            <Link
              href="/carte"
              className="group rounded-3xl border border-sky-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-3xl">
                🗺️
              </div>

              <h3 className="mt-6 text-xl font-bold text-gray-900">
                Carte
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Visualisez les signalements autour de vous
                et repérez rapidement les zones concernées.
              </p>

              <div className="mt-6 font-bold text-sky-600 transition group-hover:translate-x-1">
                Voir la carte →
              </div>

            </Link>

          </div>

        </div>

      </section>

      {/* =====================================================
          INCENDIES
      ====================================================== */}

      <section className="px-6 pb-20">

        <div className="mx-auto max-w-7xl">

          <div className="overflow-hidden rounded-3xl border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">

            <div className="flex flex-col gap-8 p-8 sm:p-10 lg:flex-row lg:items-center lg:p-12">

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-3xl">
                🔥
              </div>

              <div className="flex-1">

                <p className="text-sm font-bold uppercase tracking-widest text-orange-600">
                  Alerte importante
                </p>

                <h2 className="mt-2 text-2xl font-extrabold text-orange-950 sm:text-3xl">
                  Chats perdus lors d'une évacuation
                </h2>

                <p className="mt-3 max-w-2xl leading-7 text-orange-900/80">
                  Les évacuations peuvent entraîner la disparition
                  de nombreux animaux. Signalez rapidement votre chat
                  afin d'augmenter les chances de le retrouver.
                </p>

              </div>

              <Link
                href="/signaler/perdu"
                className="shrink-0 rounded-2xl bg-orange-600 px-6 py-4 text-center font-bold text-white shadow-md transition hover:bg-orange-700"
              >
                🔥 Signaler mon chat
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          DERNIERS SIGNALEMENTS
      ====================================================== */}

      <section className="px-6 pb-24">

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">
                En ce moment
              </p>

              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-emerald-950 sm:text-4xl">
                Les derniers signalements
              </h2>

              <p className="mt-3 text-gray-600">
                Les six signalements les plus récents.
              </p>

            </div>

            <Link
              href="/chats"
              className="font-bold text-emerald-700 transition hover:text-emerald-900"
            >
              Voir tous les chats →
            </Link>

          </div>

          {/* ERREUR */}

          {error ? (

            <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6">

              <p className="font-bold text-red-800">
                Impossible de récupérer les signalements.
              </p>

              <p className="mt-2 text-sm text-red-700">
                {error.message}
              </p>

            </div>

          ) : recentChats.length === 0 ? (

            /* AUCUN SIGNAL */

            <div className="mt-8 rounded-3xl border border-emerald-100 bg-white p-12 text-center shadow-sm">

              <div className="text-6xl">
                🐱
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Aucun signalement pour le moment
              </h3>

              <p className="mx-auto mt-2 max-w-md text-gray-600">
                Soyez le premier à signaler un chat et aidez
                sa famille à le retrouver.
              </p>

              <Link
                href="/signaler/perdu"
                className="mt-6 inline-flex rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-700"
              >
                🐱 Signaler un chat
              </Link>

            </div>

          ) : (

            /* CARTES */

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {recentChats.map((chat) => (

                <Link
                  key={chat.id}
                  href={`/chats/${chat.id}`}
                  className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >

                  {/* PHOTO */}

                  <div className="relative overflow-hidden">

                    {chat.photo_url ? (

                      <img
                        src={chat.photo_url}
                        alt={`Photo de ${chat.name || "chat"}`}
                        className="h-60 w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                    ) : (

                      <div className="flex h-60 w-full items-center justify-center bg-emerald-50 text-8xl">
                        🐱
                      </div>

                    )}

                    {/* BADGE */}

                    <div className="absolute left-4 top-4">

                      {chat.statut === "perdu" && (
                        <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-red-700 shadow-sm backdrop-blur">
                          🔴 Perdu
                        </span>
                      )}

                      {chat.statut === "trouve" && (
                        <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-sm backdrop-blur">
                          🟢 Trouvé
                        </span>
                      )}

                      {chat.statut === "retrouve" && (
                        <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-blue-700 shadow-sm backdrop-blur">
                          ✅ Retrouvé
                        </span>
                      )}

                    </div>

                  </div>

                  {/* CONTENU */}

                  <div className="p-6">

                    <div className="flex flex-wrap gap-2">

                      {chat.evacuation_incendie && (
                        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-800">
                          🔥 Évacuation
                        </span>
                      )}

                    </div>

                    <h3 className="mt-3 text-2xl font-extrabold text-gray-900">
                      {chat.name || "Chat sans nom"}
                    </h3>

                    <p className="mt-3 text-sm text-gray-600">
                      📍 {chat.location || "Lieu non renseigné"}
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">

                      <span className="text-sm font-semibold text-gray-500">
                        Voir le signalement
                      </span>

                      <span className="font-bold text-emerald-600 transition group-hover:translate-x-1">
                        →
                      </span>

                    </div>

                  </div>

                </Link>

              ))}

            </div>

          )}

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="border-t border-emerald-100 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-12">

          <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <Link
                href="/"
                className="text-xl font-extrabold text-emerald-900"
              >
                🐱 Chats Perdus
              </Link>

              <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                Une communauté pour aider les chats perdus
                et trouvés à retrouver leur famille.
              </p>

            </div>

            <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-emerald-700">

              <Link
                href="/"
                className="transition hover:text-emerald-950"
              >
                Accueil
              </Link>

              <Link
                href="/chats"
                className="transition hover:text-emerald-950"
              >
                Chats perdus
              </Link>

              <Link
                href="/chats-trouves"
                className="transition hover:text-emerald-950"
              >
                Chats trouvés
              </Link>

              <Link
                href="/carte"
                className="transition hover:text-emerald-950"
              >
                Carte
              </Link>

            </nav>

          </div>

          <div className="mt-10 border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Chats Perdus
          </div>

        </div>

      </footer>

    </main>
  );
}