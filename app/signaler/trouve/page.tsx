"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignalerChatTrouve() {
  const [message, setMessage] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const photo = formData.get("photo") as File | null;

    let photoUrl: string | null = null;

    // Envoi de la photo
    if (photo && photo.size > 0) {
      const fileName = `${Date.now()}-${photo.name}`;

      const { error: uploadError } = await supabase.storage
        .from("photos-chats")
        .upload(fileName, photo);

      if (uploadError) {
        console.error("Erreur photo :", uploadError);
        setMessage("Impossible d'envoyer la photo.");
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("photos-chats")
        .getPublicUrl(fileName);

      photoUrl = publicUrlData.publicUrl;
    }

    // Enregistrement du signalement
    const { error } = await supabase.from("chats").insert({
      name: formData.get("name") || "Chat trouvé",
      color: formData.get("color"),
      breed: formData.get("breed"),
      sex: formData.get("sex"),
      description: formData.get("description"),
      lost_date: null,
      location: formData.get("location"),
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
  console.error("Erreur Supabase complète :", error);

  setMessage(
    `Erreur Supabase : ${error.message || "Erreur inconnue"}`
  );

  return;
}

    setMessage(
      "🐱 Le chat trouvé a bien été signalé !"
    );

    form.reset();
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-2xl">

        {/* En-tête */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Nouveau signalement
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            🐱 Signaler un chat trouvé
          </h1>

          <p className="mt-4 text-gray-600">
            Vous avez trouvé un chat ? Donnez quelques informations
            pour aider son propriétaire à le retrouver.
          </p>
        </div>

        {/* Formulaire */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl bg-white p-8 shadow-sm"
        >

          {/* Nom */}
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
              placeholder="Ex : Minou (si vous le connaissez)"
              className="mt-2 w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
            />
          </div>

          {/* Couleur */}
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
              placeholder="Ex : noir et blanc"
              className="mt-2 w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
            />
          </div>

          {/* Race */}
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

          {/* Sexe */}
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

          {/* Description */}
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

          {/* Lieu */}
          <div>
            <label
              htmlFor="location"
              className="font-medium text-gray-900"
            >
              Lieu où le chat a été trouvé
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

          {/* Coordonnées */}
          <div className="grid gap-4 sm:grid-cols-2">

            <div>
              <label
                htmlFor="latitude"
                className="font-medium text-gray-900"
              >
                Latitude
              </label>

              <input
                id="latitude"
                name="latitude"
                type="number"
                step="any"
                placeholder="Ex : 44.8378"
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label
                htmlFor="longitude"
                className="font-medium text-gray-900"
              >
                Longitude
              </label>

              <input
                id="longitude"
                name="longitude"
                type="number"
                step="any"
                placeholder="Ex : -0.5792"
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
              />
            </div>

          </div>

          {/* Photo */}
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
              Une photo peut aider le propriétaire à reconnaître son chat.
            </p>
          </div>

          {/* Bouton */}
          <button
            type="submit"
            className="w-full rounded-xl bg-black px-6 py-4 font-medium text-white transition hover:bg-gray-800"
          >
            Publier le signalement
          </button>

          {/* Message */}
          {message && (
            <div className="rounded-xl bg-green-50 p-4 text-green-800">
              {message}
            </div>
          )}

        </form>
      </div>
    </main>
  );
}