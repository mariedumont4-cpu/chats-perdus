```tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

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

export default function SignalerChatPerdu() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

    const latitudeValue = String(
      formData.get("latitude") || ""
    );

    const longitudeValue = String(
      formData.get("longitude") || ""
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

    if (!city) {
      setMessage("Merci d'indiquer la ville.");
      setLoading(false);
      return;
    }

    const location = postalCode
      ? `${city} (${postalCode})`
      : city;

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

    const latitude = latitudeValue
      ? Number(latitudeValue)
      : null;

    const longitude = longitudeValue
      ? Number(longitudeValue)
      : null;

    const { error } = await supabase
      .from("chats")
      .insert({
        name,
        color,
        breed: breed || null,
        sex: sex || null,
        contact_email: contactEmail,
        lost_date: lostDate,
        location,
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
    setCity("");
    setPostalCode("");
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-emerald-50 px-6 py-16">
      <div className="mx-auto max-w-2xl">

        <Link
          href="/"
          className="text-sm font-medium text-emerald-800 hover:text-emerald-950"
        >
          ← Retour à l'accueil
        </Link>

        <div className="mb-10 mt-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">
            Nouveau signalement
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-950">
            🐱 Signaler un chat perdu
          </h1>

          <p className="mt-4 text-lg text-gray-800">
            Aidez-nous à retrouver votre compagnon
            en partageant quelques informations.
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
              required
              placeholder="Ex : Minou"
              className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
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
              className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
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
              className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
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
              className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            >
              <option value="">
                Sélectionner
              </option>
              <option value="male">Mâle</option>
              <option value="female">Femelle</option>
              <option value="unknown">
                Je ne sais pas
              </option>
            </select>
          </div>

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
              className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="font-semibold text-gray-950"
            >
              Ville de disparition
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
              className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />

            {searchingCity && (
              <p className="mt-2 text-sm text-gray-700">
                Recherche de la ville...
              </p>
            )}

            {postalCode && (
              <p className="mt-2 font-medium text-gray-900">
                📮 Code postal détecté : {postalCode}
              </p>
            )}
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
              className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
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
                className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-emerald-600"
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
                className="mt-2 w-full rounded-lg border border-gray-400 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-emerald-600"
              />
            </div>
          </div>

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

                <span className="mt-1 block text-sm text-gray-800">
                  Cochez cette case si votre chat a disparu
                  pendant ou après une évacuation.
                </span>
              </span>
            </label>
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

            <p className="mt-2 text-sm text-gray-700">
              Une photo peut aider à reconnaître votre chat.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-700 px-6 py-4 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Publication en cours..."
              : "🐱 Publier le signalement"}
          </button>

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
```
