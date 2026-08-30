"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const races = [
  "Européen / Chat de gouttière",
  "Maine Coon",
  "Persan",
  "Siamois",
  "Bengal",
  "Ragdoll",
  "British Shorthair",
  "Chartreux",
  "Sphynx",
  "Sacré de Birmanie",
  "Norvégien",
  "Scottish Fold",
  "Abyssin",
  "Bleu Russe",
  "Angora Turc",
  "Autre",
  "Je ne sais pas",
];

export default function SignalerChatTrouve() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const photo = formData.get("photo") as File | null;

    let photoUrl: string | null = null;

    if (photo && photo.size > 0) {
      const fileExtension =
        photo.name.split(".").pop() || "jpg";

      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExtension}`;

      const { error: uploadError } =
        await supabase.storage
          .from("photos-chats")
          .upload(fileName, photo);

      if (uploadError) {
        console.error(
          "Erreur photo :",
          uploadError
        );

        setMessage(
          "Impossible d'envoyer la photo."
        );

        setLoading(false);
        return;
      }

      const { data: publicUrlData } =
        supabase.storage
          .from("photos-chats")
          .getPublicUrl(fileName);

      photoUrl = publicUrlData.publicUrl;
    }

    const { error } = await supabase
      .from("chats")
      .insert({
        name:
          formData.get("name") ||
          "Chat trouvé",

        color:
          formData.get("color"),

        breed:
          formData.get("breed") || null,

        sex:
          formData.get("sex") || null,

        description:
          formData.get("description") || null,

        lost_date: null,

        location:
          formData.get("location"),

        latitude:
          formData.get("latitude")
            ? Number(formData.get("latitude"))
            : null,

        longitude:
          formData.get("longitude")
            ? Number(formData.get("longitude"))
            : null,

        photo_url:
          photoUrl,

        statut:
          "trouve",
      });

    if (error) {
      console.error(
        "Erreur Supabase complète :",
        error
      );

      setMessage(
        `Erreur Supabase : ${
          error.message ||
          "Erreur inconnue"
        }`
      );

      setLoading(false);
      return;
    }

    setMessage(
      "🐱 Le chat trouvé a bien été signalé !"
    );

    form.reset();
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-2xl">

        {/* RETOUR */}

        <Link
          href="/"
          className="text-sm font-medium text-gray-700 hover:text-black"
        >
          ← Retour à l'accueil
        </Link>

        {/* EN-TÊTE */}

        <div className="mb-10 mt-8">

          <p className="text-sm font-semibold uppercase tracking-wide text-gray-700">
            Nouveau signalement
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            🐱 Signaler un chat trouvé
          </h1>

          <p className="mt-4 text-gray-800">
            Vous avez trouvé un chat ? Donnez quelques
            informations pour aider son propriétaire
            à le retrouver.
          </p>

        </div>

        {/* FORMULAIRE */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl bg-white p-8 shadow-sm"
        >

          {/* NOM */}

          <div>
            <label
              htmlFor="name"
              className="font-semibold text-black"
            >
              Nom du chat
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Ex : Minou (si vous le connaissez)"
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          {/* COULEUR */}

          <div>
            <label
              htmlFor="color"
              className="font-semibold text-black"
            >
              Couleur / robe
            </label>

            <input
              id="color"
              name="color"
              type="text"
              required
              placeholder="Ex : noir et blanc"
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          {/* RACE */}

          <div>
            <label
              htmlFor="breed"
              className="font-semibold text-black"
            >
              Race
            </label>

            <select
              id="breed"
              name="breed"
              defaultValue=""
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 text-black outline-none focus:border-black focus:ring-1 focus:ring-black"
            >
              <option value="">
                Sélectionner une race
              </option>

              {races.map((race) => (
                <option key={race} value={race}>
                  {race}
                </option>
              ))}
            </select>
          </div>

          {/* SEXE */}

          <div>
            <label
              htmlFor="sex"
              className="font-semibold text-black"
            >
              Sexe
            </label>

            <select
              id="sex"
              name="sex"
              defaultValue=""
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 text-black outline-none focus:border-black focus:ring-1 focus:ring-black"
            >
              <option value="">
                Sélectionner
              </option>

              <option value="male">
                Mâle
              </option>

              <option value="female">
                Femelle
              </option>

              <option value="unknown">
                Je ne sais pas
              </option>
            </select>
          </div>

          {/* DESCRIPTION */}

          <div>
            <label
              htmlFor="description"
              className="font-semibold text-black"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows={5}
              placeholder="Collier, tatouage, particularités physiques, comportement..."
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          {/* LIEU */}

          <div>
            <label
              htmlFor="location"
              className="font-semibold text-black"
            >
              Lieu où le chat a été trouvé
            </label>

            <input
              id="location"
              name="location"
              type="text"
              required
              placeholder="Ex : Bordeaux, quartier Saint-Michel"
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          {/* COORDONNÉES */}

          <div className="grid gap-4 sm:grid-cols-2">

            <div>
              <label
                htmlFor="latitude"
                className="font-semibold text-black"
              >
                Latitude
              </label>

              <input
                id="latitude"
                name="latitude"
                type="number"
                step="any"
                placeholder="Ex : 44.8378"
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-black"
              />
            </div>

            <div>
              <label
                htmlFor="longitude"
                className="font-semibold text-black"
              >
                Longitude
              </label>

              <input
                id="longitude"
                name="longitude"
                type="number"
                step="any"
                placeholder="Ex : -0.5792"
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-black"
              />
            </div>

          </div>

          {/* PHOTO */}

          <div>
            <label
              htmlFor="photo"
              className="font-semibold text-black"
            >
              Photo du chat
            </label>

            <input
              id="photo"
              name="photo"
              type="file"
              accept="image/*"
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 text-black"
            />

            <p className="mt-2 text-sm text-gray-700">
              Une photo peut aider le propriétaire
              à reconnaître son chat.
            </p>
          </div>

          {/* BOUTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black px-6 py-4 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Publication en cours..."
              : "🐱 Publier le signalement"}
          </button>

          {/* MESSAGE */}

          {message && (
            <div className="rounded-xl bg-green-50 p-4 text-sm font-medium text-green-900">
              {message}
            </div>
          )}

        </form>

      </div>
    </main>
  );
}