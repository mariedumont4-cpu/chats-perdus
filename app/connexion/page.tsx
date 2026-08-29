"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ConnexionPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Erreur connexion :", error);

      setMessage(
        "E-mail ou mot de passe incorrect."
      );

      setLoading(false);
      return;
    }

    setMessage("✅ Connexion réussie !");

    window.location.href = "/";
  }

  return (
    <main className="min-h-screen bg-emerald-50 px-6 py-16">
      <div className="mx-auto max-w-md">

        <div className="rounded-2xl bg-white p-8 shadow-sm">

          <h1 className="text-3xl font-bold text-gray-900">
            👋 Connexion
          </h1>

          <p className="mt-3 text-gray-600">
            Connectez-vous pour gérer vos signalements
            et recevoir les messages concernant votre chat.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            <div>
              <label
                htmlFor="email"
                className="font-medium text-gray-900"
              >
                Adresse e-mail
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
                placeholder="vous@email.fr"
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="font-medium text-gray-900"
              >
                Mot de passe
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
                placeholder="Votre mot de passe"
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-700 px-6 py-4 font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
            >
              {loading
                ? "Connexion..."
                : "Se connecter"}
            </button>

          </form>

          {message && (
            <div className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
              {message}
            </div>
          )}

          <div className="mt-6 border-t pt-6 text-center text-sm text-gray-600">

            <p>
              Vous n'avez pas encore de compte ?
            </p>

            <Link
              href="/inscription"
              className="mt-2 inline-block font-semibold text-emerald-700 hover:text-emerald-900"
            >
              Créer un compte
            </Link>

          </div>

        </div>

      </div>
    </main>
  );
}