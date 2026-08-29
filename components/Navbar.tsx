import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-emerald-100 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-6 py-4">

        <Link
          href="/"
          className="mr-auto text-xl font-bold text-emerald-800"
        >
          🐱 Chats Perdus
        </Link>

        <Link
          href="/"
          className="rounded-xl px-4 py-2 font-medium text-emerald-800 transition hover:bg-emerald-50"
        >
          🏠 Accueil
        </Link>

        <Link
          href="/chats"
          className="rounded-xl px-4 py-2 font-medium text-emerald-800 transition hover:bg-emerald-50"
        >
          🔴 Chats perdus
        </Link>

        <Link
          href="/chats-trouves"
          className="rounded-xl px-4 py-2 font-medium text-emerald-800 transition hover:bg-emerald-50"
        >
          🟢 Chats trouvés
        </Link>

        <Link
          href="/carte"
          className="rounded-xl px-4 py-2 font-medium text-emerald-800 transition hover:bg-emerald-50"
        >
          🗺️ Carte
        </Link>

      </div>
    </nav>
  );
}