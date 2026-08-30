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

export default function SignalerChatPerdu() {
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

    const name = String(formData.get("name") || "");
    const color = String(formData.get("color") || "");
    const breed = String(formData.get("breed") || "");
    const sex = String(formData.get("sex") || "");
    const contactEmail = String(
      formData.get("contact_email") || ""
    );
    const lostDate = String(
      formData.get("lost_date") || ""
    );
    const description = String(
      formData.get("description") || ""
    );

    const evacuationIncendie =
      formData.get("evacuation_incendie") === "true";

    if (!lostDate) {
      setMessage(
        "Merci d'indiquer la date de disparition."
      );
      setLoading(false);
      return;
    }

    if (!contactEmail) {
      setMessage(
        "Merci d'indiquer votre adresse e-mail."
      );
      setLoading(false);
      return;
    }

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
        console.error(
          "Erreur upload photo :",
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

    // =========================
    // ENREGISTREMENT
    // =========================

    const { error } = await supabase
      .from("chats")
      .insert({
        name,
        color,
        breed: breed || null,
        sex: sex || null,
        contact_email: contactEmail,
        lost_date: lostDate,
        location: selectedLocation,
        description: description || null,
        latitude,
        longitude,
        photo_url: photoUrl,
        statut: "perdu",
        evacuation_incendie: evacuationIncendie,
      });

    if (error) {
      console.error("Erreur Supabase :", error);

      setMessage(
        "Erreur : le signalement n'a pas pu être enregistré."
      );

      setLoading(false);
      return;
    }

    setMessage(
      "🐱 Votre signalement a bien été enregistré !"
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
    <main className="min-h-screen bg-emerald-50 px-6 py-16">
      <div className="mx-auto max-w-2xl">

        {/* RETOUR */}

        <Link
          href="/"
          className="text-sm font-medium text-emerald-700 hover:text-emerald-900"
        >
          ← Retour à l'accueil
        </Link>

        {/* TITRE */}

        <div className="mt-8 mb-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Nouveau signalement
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-950">
            🐱 Signaler un chat perdu
          </h1>

          <p className="mt-4 text-lg text-gray-700">
            Aidez-nous à retrouver votre compagnon
            en partageant quelques informations.
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
              required
              placeholder="Ex : Minou"
              className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
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
              className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
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
              className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
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
              className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black outline-none focus:border-emerald-600"
            >
              <option value="">Sélectionner</option>
              <option value="male">Mâle</option>
              <option value="female">Femelle</option>
              <option value="unknown">Je ne sais pas</option>
            </select>
          </div>

          {/* EMAIL */}

          <div>
            <label
              htmlFor="contact_email"
              className="font-semibold text-gray-950"
            >
              Votre adresse e-mail
            </label>

            <input
              id="contact_email"
              name="contact_email"
              type="email"
              required
              placeholder="vous@exemple.fr"
              className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />

            <p className="mt-2 text-sm text-gray-700">
              Cette adresse restera privée et permettra
              aux personnes ayant une information sur votre
              chat de vous contacter.
            </p>
          </div>

          {/* DATE */}

          <div>
            <label
              htmlFor="lost_date"
              className="font-semibold text-gray-950"
            >
              Date de disparition
            </label>

            <input
              id="lost_date"
              name="lost_date"
              type="date"
              required
              className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black outline-none focus:border-emerald-600"
            />
          </div>

          {/* LOCALISATION */}

          <div className="relative">
            <label
              htmlFor="location"
              className="font-semibold text-gray-950"
            >
              📍 Où le chat a-t-il été perdu ?
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
              className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
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
                    className="block w-full border-b border-gray-100 px-4 py-3 text-left text-black hover:bg-emerald-50"
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
              className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          {/* INCENDIES */}

          <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">
            <label className="flex cursor-pointer items-start gap-3">

              <input
                type="checkbox"
                name="evacuation_incendie"
                value="true"
                className="mt-1 h-5 w-5"
              />

              <span>
                <span className="block font-semibold text-gray-950">
                  🔥 Ce chat a été perdu suite à une évacuation liée aux incendies
                </span>

                <span className="mt-1 block text-sm text-gray-700">
                  Cochez cette case si votre chat a disparu
                  pendant ou après une évacuation.
                </span>
              </span>

            </label>
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
              Une photo peut aider à reconnaître votre chat.
            </p>
          </div>

          {/* BOUTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-700 px-6 py-4 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Publication en cours..."
              : "🐱 Publier le signalement"}
          </button>

          {/* MESSAGE */}

          {message && (
            <div className="rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-gray-950">
              {message}
            </div>
          )}

        </form>
      </div>
    </main>
  );
}