"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function SignalerChatPerdu() {
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
    const location = String(
      formData.get("location") || ""
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

    // =========================
    // VÉRIFICATIONS
    // =========================

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
    // COORDONNÉES
    // =========================

    const latitude = latitudeValue
      ? Number(latitudeValue)
      : null;

    const longitude = longitudeValue
      ? Number(longitudeValue)
      : null;

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
        location,
        description: description || null,
        latitude,
        longitude,
        photo_url: photoUrl,
        statut: "perdu",
        evacuation_incendie: evacuationIncendie,
      });

    // =========================
    // ERREUR
    // =========================

    if (error) {
      console.error(
        "Erreur Supabase :",
        error
      );

      setMessage(
        "Erreur : le signalement n'a pas pu être enregistré."
      );

      setLoading(false);
      return;
    }

    // =========================
    // SUCCÈS
    // =========================

    setMessage(
      "🐱 Votre signalement a bien été enregistré !"
    );

    form.reset();
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-emerald-50 px-6 py-16">
      <div className="mx-auto max-w-2xl">

        <Link
          href="/"
          className="text-sm font-medium text-emerald-700 hover:text-emerald-900"
        >
          ← Retour à l'accueil
        </Link>

        <div className="mb-10 mt-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Nouveau signalement
          </p>

          <h1 className="mt-2 text-4xl font-bold text-black">
            🐱 Signaler un chat perdu
          </h1>

          <p className="mt-4 text-gray-700">
            Aidez-nous à retrouver votre compagnon
            en partageant quelques informations.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl bg-white p-8 shadow-sm"
        >

          {/* NOM */}

          <div>
            <label
              htmlFor="name"
              className="font-medium text-black"
            >
              Nom du chat
            </label>

            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Ex : Minou"
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* COULEUR */}

          <div>
            <label
              htmlFor="color"
              className="font-medium text-black"
            >
              Couleur / robe
            </label>

            <input
              id="color"
              name="color"
              type="text"
              required
              placeholder="Ex : noir et blanc"
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* RACE */}

          <div>
            <label
              htmlFor="breed"
              className="font-medium text-black"
            >
              Race
            </label>

            <input
              id="breed"
              name="breed"
              type="text"
              placeholder="Ex : Européen"
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* SEXE */}

          <div>
            <label
              htmlFor="sex"
              className="font-medium text-black"
            >
              Sexe
            </label>

            <select
              id="sex"
              name="sex"
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 text-black outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
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
              className="font-medium text-black"
            >
              Votre adresse e-mail
            </label>

            <input
              id="contact_email"
              name="contact_email"
              type="email"
              required
              placeholder="vous@exemple.fr"
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />

            <p className="mt-2 text-sm text-gray-600">
              Cette adresse restera privée et permettra
              aux personnes ayant une information sur votre
              chat de vous contacter.
            </p>
          </div>

          {/* DATE */}

          <div>
            <label
              htmlFor="lost_date"
              className="font-medium text-black"
            >
              Date de disparition
            </label>

            <input
              id="lost_date"
              name="lost_date"
              type="date"
              required
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 text-black outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* LIEU */}

          <div>
            <label
              htmlFor="location"
              className="font-medium text-black"
            >
              Lieu de disparition
            </label>

            <input
              id="location"
              name="location"
              type="text"
              required
              placeholder="Ex : Bordeaux, quartier Saint-Michel"
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* DESCRIPTION */}

          <div>
            <label
              htmlFor="description"
              className="font-medium text-black"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows={5}
              placeholder="Collier, tatouage, particularités physiques, comportement..."
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* COORDONNÉES */}

          <div className="grid gap-4 sm:grid-cols-2">

            <div>
              <label
                htmlFor="latitude"
                className="font-medium text-black"
              >
                Latitude
              </label>

              <input
                id="latitude"
                name="latitude"
                type="number"
                step="any"
                placeholder="Ex : 44.8378"
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label
                htmlFor="longitude"
                className="font-medium text-black"
              >
                Longitude
              </label>

              <input
                id="longitude"
                name="longitude"
                type="number"
                step="any"
                placeholder="Ex : -0.5792"
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

          </div>

          {/* INCENDIES */}

          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5">

            <label className="flex cursor-pointer items-start gap-3">

              <input
                type="checkbox"
                name="evacuation_incendie"
                value="true"
                className="mt-1 h-5 w-5 rounded border-gray-300 text-emerald-700"
              />

              <span>
                <span className="block font-semibold text-black">
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
              className="font-medium text-black"
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

            <p className="mt-2 text-sm text-gray-600">
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
            <div className="rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
              {message}
            </div>
          )}

        </form>
      </div>
    </main>
  );
}