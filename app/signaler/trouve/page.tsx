"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import MapPicker from "@/components/MapPicker";

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

type Commune = {
  nom: string;
  codesPostaux?: string[];
  centre?: {
    coordinates?: [number, number];
  };
};

export default function SignalerChatTrouve() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [cityResults, setCityResults] = useState<Commune[]>([]);
  const [showCities, setShowCities] = useState(false);
  const [searchingCity, setSearchingCity] = useState(false);

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  async function searchCity(value: string) {
    setCity(value);
    setPostalCode("");
    setShowCities(false);

    if (value.trim().length < 2) {
      setCityResults([]);
      return;
    }

    setSearchingCity(true);

    try {
      const response = await fetch(
        `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(
          value.trim()
        )}&fields=nom,codesPostaux,centre&limit=8`
      );

      if (!response.ok) {
        throw new Error("Erreur API villes");
      }

      const communes: Commune[] = await response.json();

      setCityResults(communes);
      setShowCities(communes.length > 0);
    } catch (error) {
      console.error("Erreur recherche ville :", error);
      setCityResults([]);
      setShowCities(false);
    } finally {
      setSearchingCity(false);
    }
  }

  function selectCity(commune: Commune) {
    const codePostal = commune.codesPostaux?.[0] || "";

    setCity(commune.nom);
    setPostalCode(codePostal);
    setCityResults([]);
    setShowCities(false);

    const coordinates = commune.centre?.coordinates;

    if (coordinates && coordinates.length === 2) {
      setLongitude(coordinates[0]);
      setLatitude(coordinates[1]);
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name =
      String(formData.get("name") || "") ||
      "Chat trouvé";

    const color = String(formData.get("color") || "");
    const breed = String(formData.get("breed") || "");
    const sex = String(formData.get("sex") || "");

    const description = String(
      formData.get("description") || ""
    );

    if (!color) {
      setMessage("Merci d'indiquer la couleur du chat.");
      setLoading(false);
      return;
    }

    if (!breed) {
      setMessage("Merci de sélectionner une race.");
      setLoading(false);
      return;
    }

    if (!city) {
      setMessage("Merci de sélectionner une ville.");
      setLoading(false);
      return;
    }

    const location = postalCode
      ? `${city} (${postalCode})`
      : city;

    const photo = formData.get("photo") as File | null;

    let photoUrl: string | null = null;

    if (photo && photo.size > 0) {
      const extension =
        photo.name.split(".").pop() || "jpg";

      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${extension}`;

      const { error: uploadError } =
        await supabase.storage
          .from("photos-chats")
          .upload(fileName, photo);

      if (uploadError) {
        console.error("Erreur upload photo :", uploadError);
        setMessage("Impossible d'envoyer la photo.");
        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from("photos-chats")
        .getPublicUrl(fileName);

      photoUrl = data.publicUrl;
    }

    const { error } = await supabase
      .from("chats")
      .insert({
        name,
        color,
        breed,
        sex: sex || null,
        description: description || null,
        lost_date: null,
        location,
        latitude,
        longitude,
        photo_url: photoUrl,
        statut: "trouve",
      });

    if (error) {
      console.error("Erreur Supabase :", error);

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
    setCityResults([]);
    setShowCities(false);
    setLatitude(null);
    setLongitude(null);

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-2xl">

        <Link
          href="/"
          className="text-sm font-semibold text-black hover:text-emerald-700"
        >
          ← Retour à l'accueil
        </Link>

        <div className="mb-10 mt-8">
          <p className="text-sm font-bold uppercase tracking-wide text-black">
            Nouveau signalement
          </p>

          <h1 className="mt-2 text-4xl font-bold text-black">
            🐱 Signaler un chat trouvé
          </h1>

          <p className="mt-4 text-lg text-black">
            Vous avez trouvé un chat ? Donnez quelques
            informations pour aider son propriétaire à le
            retrouver.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl bg-white p-8 shadow-sm"
        >

          <div>
            <label
              htmlFor="name"
              className="font-bold text-black"
            >
              Nom du chat
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Ex : Minou (si vous le connaissez)"
              className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label
              htmlFor="color"
              className="font-bold text-black"
            >
              Couleur / robe
            </label>

            <input
              id="color"
              name="color"
              type="text"
              required
              placeholder="Ex : noir et blanc"
              className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label
              htmlFor="breed"
              className="font-bold text-black"
            >
              Race
            </label>

            <select
              id="breed"
              name="breed"
              required
              className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black outline-none focus:border-black focus:ring-1 focus:ring-black"
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
              className="font-bold text-black"
            >
              Sexe
            </label>

            <select
              id="sex"
              name="sex"
              className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black outline-none focus:border-black focus:ring-1 focus:ring-black"
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
              className="font-bold text-black"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows={5}
              placeholder="Collier, tatouage, particularités physiques, comportement..."
              className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="relative">
            <label
              htmlFor="location"
              className="font-bold text-black"
            >
              Ville où le chat a été trouvé
            </label>

            <input
              id="location"
              name="location"
              type="text"
              required
              value={city}
              autoComplete="off"
              onChange={(event) =>
                searchCity(event.target.value)
              }
              onFocus={() => {
                if (cityResults.length > 0) {
                  setShowCities(true);
                }
              }}
              placeholder="Ex : Bordeaux"
              className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-black focus:ring-1 focus:ring-black"
            />

            {searchingCity && (
              <p className="mt-2 text-sm font-medium text-black">
                Recherche des villes...
              </p>
            )}

            {showCities && cityResults.length > 0 && (
              <div className="absolute left-0 right-0 z-20 mt-1 overflow-hidden rounded-lg border border-gray-400 bg-white shadow-lg">
                {cityResults.map((commune, index) => (
                  <button
                    key={`${commune.nom}-${index}`}
                    type="button"
                    onClick={() => selectCity(commune)}
                    className="block w-full border-b border-gray-200 px-4 py-3 text-left text-black hover:bg-gray-100"
                  >
                    <span className="font-semibold">
                      {commune.nom}
                    </span>

                    {commune.codesPostaux?.[0] && (
                      <span className="ml-2 text-gray-700">
                        {commune.codesPostaux[0]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {postalCode && (
              <p className="mt-2 font-bold text-black">
                📮 Code postal : {postalCode}
              </p>
            )}
          </div>

          <div>
            <p className="mb-3 font-bold text-black">
              📍 Emplacement sur la carte
            </p>

            <MapPicker
              latitude={latitude}
              longitude={longitude}
              onPositionChange={(lat, lng) => {
                setLatitude(lat);
                setLongitude(lng);
              }}
            />

            {latitude !== null &&
              longitude !== null && (
                <p className="mt-3 text-sm font-semibold text-black">
                  Position sélectionnée :{" "}
                  {latitude.toFixed(5)},{" "}
                  {longitude.toFixed(5)}
                </p>
              )}
          </div>

          <div>
            <label
              htmlFor="photo"
              className="font-bold text-black"
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

            <p className="mt-2 text-sm text-black">
              Une photo peut aider le propriétaire à
              reconnaître son chat.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black px-6 py-4 font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Publication en cours..."
              : "Publier le signalement"}
          </button>

          {message && (
            <div className="rounded-xl bg-green-50 p-4 font-bold text-black">
              {message}
            </div>
          )}

        </form>
      </div>
    </main>
  );
}