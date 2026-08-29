"use client";

import { useState } from "react";

type ContactOwnerButtonProps = {
  email: string;
  chatName: string;
};

export default function ContactOwnerButton({
  email,
  chatName,
}: ContactOwnerButtonProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const subject = `Information concernant ${chatName}`;

    const body = `Bonjour,

Je vous contacte concernant votre annonce pour ${chatName}.

${message}

Bonne journée.`;

    const mailto = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
  }

  return (
    <div className="mt-8">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full rounded-xl bg-emerald-600 px-6 py-4 font-semibold text-white transition hover:bg-emerald-700"
        >
          📩 Contacter le propriétaire
        </button>
      ) : (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              📩 Contacter le propriétaire
            </h2>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Fermer
            </button>
          </div>

          <p className="mt-3 text-sm text-gray-600">
            Vous avez une information concernant{" "}
            <strong>{chatName}</strong> ?
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-5 space-y-4"
          >
            <div>
              <label
                htmlFor="contact-message"
                className="font-medium text-gray-900"
              >
                Votre message
              </label>

              <textarea
                id="contact-message"
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                required
                rows={6}
                placeholder="Bonjour, je pense avoir vu votre chat..."
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white p-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800"
            >
              Ouvrir mon application e-mail
            </button>

            <p className="text-xs text-gray-500">
              Votre application e-mail s'ouvrira avec le
              destinataire et le message préremplis.
            </p>
          </form>
        </div>
      )}
    </div>
  );
}