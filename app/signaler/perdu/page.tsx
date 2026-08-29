"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";

const MapPicker = dynamic(
  () => import("@/components/MapPicker"),
  {
    ssr: false,
  }
);

export default function SignalerChatPerdu() {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [evacuationIncendie, setEvacuationIncendie] =
    useState(false);

  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");
    setIsError(false);
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const photo = formData.get("photo") as File | null;

    let photoUrl: string | null = null;

    // =========================
    // ENVOI DE LA PHOTO
    // =========================

    if (photo && photo.size > 0) {
      const fileName = `${Date.now()}-${photo.name}`;

      const { error: uploadError } = await supabase.storage
        .from("photos-chats")
        .upload(fileName, photo);

      if (uploadError) {
        console.error("Erreur photo :", uploadError);

        setIsError(true);
        setMessage(
          "Impossible d'envoyer la photo. Veuillez réessayer."
        );

        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("photos-chats")
        .getPublicUrl(fileName);

      photoUrl = publicUrlData.publicUrl;
    }

    // =========================
    // ENREGISTREMENT SUPABASE
    // =========================

    const { error } = await supabase
      .from("chats")
      .insert({
        name: formData.get("name"),
        color: formData.get("color"),
        breed: formData.get("breed"),
        sex: formData.get("sex"),
        description: formData.get("description"),
        lost_date: formData.get("lostDate"),
        location: formData.get("location"),
        latitude,
        longitude,
        photo_url: photoUrl,

        // Statut du signalement
        statut: "perdu",

        // Évacuation incendie
        evacuation_incendie: evacuationIncendie,
      });

    if (error) {
      console.error("Erreur Supabase :", error);

      setIsError(true);
      setMessage(
        `Erreur : ${error.message}`
      );

      setLoading(false);
      return;
    }

    // =========================
    // SUCCÈS
    // =========================

    setIsError(false);

    setMessage(
      "🐱 Votre signalement a bien été enregistré !"
    );

    form.reset();

    setLatitude(null);
    setLongitude(null);
    setEvacuationIncendie(false);

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-2xl">

        {/* =========================
            EN-TÊTE
        ========================= */}

        <div className="mb-10">

          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Nouveau signalement
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            🐱 Signaler un chat perdu
          </h1>

          <p className="mt-4 text-gray-600">
            Donnez-nous le plus d'informations possible
            pour aider les personnes à reconnaître votre chat.
          </p>

        </div>

        {/* =========================
            FORMULAIRE
        ========================= */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl bg-white p-8 shadow-sm"
        >

          {/* NOM */}

          <div>
            <label
              htmlFor="name"
              className="font-medium text-gray-900"
            >
              Nom du chat
            </label>

            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Ex : Minou"
              className="mt-2 w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
            />
          </div>

          {/* COULEUR */}

          <div>
            <label
              htmlFor="color"
              className="font-medium text-gray-900"
            >
              Couleur / robe
            </label>

            <input
              id="color"
              name="color"
              type="text"
              required
              placeholder="Ex : gris tigré et blanc"
              className="mt-2 w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
            />
          </div>

          {/* RACE */}

          <div>
            <label
              htmlFor="breed"
              className="font-medium text-gray-900"
            >
              Race
            </label>

            <input
              id="breed"
              name="breed"
              type="text"
              placeholder="Ex : Européen"
              className="mt-2 w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
            />
          </div>

          {/* SEXE */}

          <div>
            <label
              htmlFor="sex"
              className="font-medium text-gray-900"
            >
              Sexe
            </label>

            <select
              id="sex"
              name="sex"
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3"
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
              className="font-medium text-gray-900"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows={5}
              placeholder="Collier, tatouage, particularités physiques, comportement..."
              className="mt-2 w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
            />
          </div>

          {/* DATE */}

          <div>
            <label
              htmlFor="lostDate"
              className="font-medium text-gray-900"
            >
              Date de disparition
            </label>

            <input
              id="lostDate"
              name="lostDate"
              type="date"
              required
              className="mt-2 w-full rounded-lg border border-gray-300 p-3"
            />
          </div>

          {/* LIEU */}

          <div>
            <label
              htmlFor="location"
              className="font-medium text-gray-900"
            >
              Lieu de disparition
            </label>

            <input
              id="location"
              name="location"
              type="text"
              required
              placeholder="Ex : Bordeaux, quartier Saint-Michel"
              className="mt-2 w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
            />
          </div>

          {/* =========================
              CARTE
          ========================= */}

          <div>

            <label className="font-medium text-gray-900">
              📍 Où votre chat a-t-il disparu ?
            </label>

            <p className="mt-2 mb-4 text-sm text-gray-500">
              Cliquez directement sur la carte pour indiquer
              le lieu de disparition.
            </p>

            <MapPicker
              latitude={latitude}
              longitude={longitude}
              onChange={(lat, lng) => {
                setLatitude(lat);
                setLongitude(lng);
              }}
            />

            {latitude !== null &&
              longitude !== null && (
                <p className="mt-3 text-sm text-gray-500">
                  Position sélectionnée :{" "}
                  {latitude.toFixed(5)},{" "}
                  {longitude.toFixed(5)}
                </p>
              )}

          </div>

          {/* =========================
              ÉVACUATION INCENDIE
          ========================= */}

          <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">

            <label className="flex cursor-pointer items-start gap-3">

              <input
                type="checkbox"
                checked={evacuationIncendie}
                onChange={(event) =>
                  setEvacuationIncendie(
                    event.target.checked
                  )
                }
                className="mt-1 h-5 w-5 rounded border-gray-300"
              />

              <div>

                <p className="font-semibold text-gray-900">
                  🔥 Chat perdu lors d'une évacuation incendie
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Cochez cette case si votre chat a été perdu
                  pendant une évacuation liée aux incendies.
                </p>

              </div>

            </label>

          </div>

          {/* =========================
              PHOTO
          ========================= */}

          <div>

            <label
              htmlFor="photo"
              className="font-medium text-gray-900"
            >
              Photo du chat
            </label>

            <input
              id="photo"
              name="photo"
              type="file"
              accept="image/*"
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3"
            />

            <p className="mt-2 text-sm text-gray-500">
              Une photo peut aider à reconnaître votre chat.
            </p>

          </div>

          {/* =========================
              BOUTON
          ========================= */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black px-6 py-4 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Enregistrement..."
              : "Publier le signalement"}
          </button>

          {/* =========================
              MESSAGE
          ========================= */}

          {message && (
            <div
              className={`rounded-xl p-4 ${
                isError
                  ? "bg-red-50 text-red-800"
                  : "bg-green-50 text-green-800"
              }`}
            >
              {message}
            </div>
          )}

        </form>
      </div>
    </main>
  );
}