```tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const races = [
  "Européen",
  "Persan",
  "Maine Coon",
  "Siamois",
  "Sacré de Birmanie",
  "Ragdoll",
  "Bengal",
  "British Shorthair",
  "Chartreux",
  "Sphynx",
  "Norvégien",
  "Angora",
  "Scottish Fold",
  "Abyssin",
  "Bleu Russe",
  "Exotic Shorthair",
  "Autre",
  "Je ne sais pas",
];

export default function SignalerChatTrouve() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [searchingCity, setSearchingCity] = useState(false);

  async function searchCity(value: string) {
    setCity(value);

    if (value.length < 2) {
      setPostalCode("");
      return;
    }

    setSearchingCity(true);

    try {
      const response = await fetch(
        `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(
          value
        )}&fields=nom,codesPostaux&limit=5`
      );

      const communes = await response.json();

      if (communes.length > 0) {
        setPostalCode(
          communes[0].codesPostaux?.[0] || ""
        );
      } else {
        setPostalCode("");
      }
    } catch (error) {
      console.error("Erreur recherche ville :", error);
    }

    setSearchingCity(false);
  }

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
        console.error("Erreur photo :", uploadError);

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

    if (!city) {
      setMessage("Merci d'indiquer la ville.");
      setLoading(false);
      return;
    }

    const location = postalCode
      ? `${city} (${postalCode})`
      : city;

    const { error } = await supabase
      .from("chats")
      .insert({
        name:
          String(formData.get("name") || "") ||
          "Chat trouvé",

        color: String(
          formData.get("color") || ""
        ),

        breed:
          String(formData.get("breed") || "") ||
          null,

        sex:
          String(formData.get("sex") || "") ||
          null,

        description:
          String(formData.get("description") || "") ||
          null,

        lost_date: null,

        location,

        latitude: formData.get("latitude")
          ? Number(formData.get("latitude"))
          : null,

        longitude: formData.get("longitude")
          ? Number(formData.get("longitude"))
          : null,

        photo_url: photoUrl,

        statut: "trouve",
      });

    if (error) {
      console.error(
        "Erreur Supabase complète :",
        error
      );

      setMessage(
        `Erreur Supabase : ${
          error.message || "Erreur inconnue"
        }`
      );

      setLoading(false);
      return;
    }

    setMessage(
      "🐱 Le chat trouvé a bien été signalé !"
    );

    form.reset();
    setCity("");
    setPostalCode("");
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-2xl">

        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-900">
            Nouveau signalement
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-950">
            🐱 Signaler un chat trouvé
          </h1>

          <p className="mt-4 text-lg text-gray-800">
            Vous avez trouvé un chat ? Donnez quelques informations
            pour aider son propriétaire à le retrouver.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl bg-white p-8 shadow-sm"
        >

          <div>
            <label
              htmlFor="name"
              className="font-semibold text-gray-950"
            >
              Nom du chat
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Ex : Minou (si vous le connaissez)"
              className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-black"
            />
          </div>

          <div>
            <label
              htmlFor="color"
              className="font-semibold text-gray-950"
            >
              Couleur / robe
            </label>

            <input
              id="color"
              name="color"
              type="text"
              required
              placeholder="Ex : noir et blanc"
              className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-black"
            />
          </div>

          <div>
            <label
              htmlFor="breed"
              className="font-semibold text-gray-950"
            >
              Race
            </label>

            <select
              id="breed"
              name="breed"
              required
              className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black outline-none focus:border-black"
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

          <div>
            <label
              htmlFor="sex"
              className="font-semibold text-gray-950"
            >
              Sexe
            </label>

            <select
              id="sex"
              name="sex"
              className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black outline-none focus:border-black"
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

          <div>
            <label
              htmlFor="description"
              className="font-semibold text-gray-950"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows={5}
              placeholder="Collier, tatouage, particularités physiques, comportement..."
              className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-black"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="font-semibold text-gray-950"
            >
              Ville où le chat a été trouvé
            </label>

            <input
              id="location"
              name="location"
              type="text"
              required
              value={city}
              onChange={(event) =>
                searchCity(event.target.value)
              }
              placeholder="Ex : Bordeaux"
              className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-black"
            />

            {searchingCity && (
              <p className="mt-2 text-sm text-gray-800">
                Recherche de la ville...
              </p>
            )}

            {postalCode && (
              <p className="mt-2 font-medium text-gray-950">
                📮 Code postal détecté : {postalCode}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            <div>
              <label
                htmlFor="latitude"
                className="font-semibold text-gray-950"
              >
                Latitude
              </label>

              <input
                id="latitude"
                name="latitude"
                type="number"
                step="any"
                placeholder="Ex : 44.8378"
                className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-black"
              />
            </div>

            <div>
              <label
                htmlFor="longitude"
                className="font-semibold text-gray-950"
              >
                Longitude
              </label>

              <input
                id="longitude"
                name="longitude"
                type="number"
                step="any"
                placeholder="Ex : -0.5792"
                className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-black"
              />
            </div>

          </div>

          <div>
            <label
              htmlFor="photo"
              className="font-semibold text-gray-950"
            >
              Photo du chat
            </label>

            <input
              id="photo"
              name="photo"
              type="file"
              accept="image/*"
              className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black"
            />

            <p className="mt-2 text-sm text-gray-800">
              Une photo peut aider le propriétaire à reconnaître son chat.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black px-6 py-4 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Publication en cours..."
              : "Publier le signalement"}
          </button>

          {message && (
            <div className="rounded-xl bg-green-50 p-4 font-semibold text-gray-950">
              {message}
            </div>
          )}

        </form>
      </div>
    </main>
  );
}
```
