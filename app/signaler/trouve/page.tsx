"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type AddressResult = {
  properties: {
    label: string;
    postcode?: string;
    city?: string;
  };
  geometry: {
    coordinates: [number, number];
  };
};

export default function SignalerChatTrouve() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [locationSearch, setLocationSearch] = useState("");
  const [suggestions, setSuggestions] = useState<AddressResult[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  async function searchLocation(value: string) {
    setLocationSearch(value);
    setSelectedLocation("");
    setLatitude(null);
    setLongitude(null);

    if (value.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
          value
        )}&limit=5`
      );

      if (!response.ok) {
        setSuggestions([]);
        return;
      }

      const data = await response.json();
      setSuggestions(data.features || []);
    } catch (error) {
      console.error("Erreur recherche adresse :", error);
      setSuggestions([]);
    }
  }

  function selectLocation(result: AddressResult) {
    const [lon, lat] = result.geometry.coordinates;

    setLocationSearch(result.properties.label);
    setSelectedLocation(result.properties.label);
    setLatitude(lat);
    setLongitude(lon);
    setSuggestions([]);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    if (!selectedLocation || latitude === null || longitude === null) {
      setMessage(
        "Merci de sélectionner une ville dans les suggestions."
      );
      setLoading(false);
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    // =========================
    // PHOTO
    // =========================

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

    // =========================
    // ENREGISTREMENT
    // =========================

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

        location: selectedLocation,

        latitude,

        longitude,

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

    setLocationSearch("");
    setSelectedLocation("");
    setSuggestions([]);
    setLatitude(null);
    setLongitude(null);

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

        {/* TITRE */}

        <div className="mt-8 mb-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-700">
            Nouveau signalement
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-950">
            🐱 Signaler un chat trouvé
          </h1>

          <p className="mt-4 text-lg text-gray-700">
            Vous avez trouvé un chat ? Donnez quelques
            informations pour aider son propriétaire à
            le retrouver.
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
              className="font-semibold text-gray-950"
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

          {/* COULEUR */}

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
              className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          {/* RACE */}

          <div>
            <label
              htmlFor="breed"
              className="font-semibold text-gray-950"
            >
              Race
            </label>

            <input
              id="breed"
              name="breed"
              type="text"
              placeholder="Ex : Européen"
              className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          {/* SEXE */}

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
              <option value="">Sélectionner</option>
              <option value="male">Mâle</option>
              <option value="female">Femelle</option>
              <option value="unknown">Je ne sais pas</option>
            </select>
          </div>

          {/* DESCRIPTION */}

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
              className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          {/* LOCALISATION */}

          <div className="relative">
            <label
              htmlFor="location"
              className="font-semibold text-gray-950"
            >
              📍 Où le chat a-t-il été trouvé ?
            </label>

            <input
              id="location"
              name="location"
              type="text"
              required
              value={locationSearch}
              onChange={(event) =>
                searchLocation(event.target.value)
              }
              placeholder="Tapez une ville ou un code postal"
              autoComplete="off"
              className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-black focus:ring-1 focus:ring-black"
            />

            {/* SUGGESTIONS */}

            {suggestions.length > 0 && (
              <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-gray-300 bg-white shadow-lg">

                {suggestions.map((result, index) => (
                  <button
                    key={`${result.properties.label}-${index}`}
                    type="button"
                    onClick={() =>
                      selectLocation(result)
                    }
                    className="block w-full border-b border-gray-100 px-4 py-3 text-left text-black hover:bg-gray-100"
                  >
                    <span className="block font-semibold">
                      {result.properties.city ||
                        result.properties.label}
                    </span>

                    <span className="text-sm text-gray-700">
                      {result.properties.postcode || ""}
                      {" · "}
                      {result.properties.label}
                    </span>
                  </button>
                ))}

              </div>
            )}

            <p className="mt-2 text-sm text-gray-700">
              Commencez à taper puis sélectionnez la bonne
              ville dans la liste.
            </p>

            {selectedLocation && (
              <p className="mt-2 font-medium text-emerald-700">
                ✓ Localisation sélectionnée
              </p>
            )}
          </div>

          {/* PHOTO */}

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

            <p className="mt-2 text-sm text-gray-700">
              Une photo peut aider le propriétaire à
              reconnaître son chat.
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
            <div className="rounded-xl bg-green-50 p-4 font-semibold text-gray-950">
              {message}
            </div>
          )}

        </form>
      </div>
    </main>
  );
}