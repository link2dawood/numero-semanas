"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type ContactStatus = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<ContactStatus>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");
    setMessage("");
    const formData = new FormData(form);
    try {
      const response = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) {
        setStatus("error");
        setMessage(result.message ?? "No se pudo enviar el mensaje. Inténtalo más tarde.");
        return;
      }
      setStatus("sent");
      setMessage("Hemos recibido tu mensaje.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("No se pudo conectar con el servicio. Inténtalo de nuevo más tarde.");
    }
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5"
    >
      <div>
        <label htmlFor="contact-name" className="mb-1.5 block font-semibold">
          Nombre
        </label>
        <input
          id="contact-name"
          name="name"
          required
          maxLength={100}
          autoComplete="name"
          className="min-h-11 w-full rounded-xl border border-border bg-white px-3 text-ink"
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="mb-1.5 block font-semibold">
          Correo electrónico
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          className="min-h-11 w-full rounded-xl border border-border bg-white px-3 text-ink"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-1.5 block font-semibold">
          Mensaje
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          className="w-full rounded-xl border border-border bg-white p-3 text-ink"
        />
      </div>
      <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">No rellenes este campo</label>
        <input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <label className="flex min-h-11 items-start gap-3">
        <input
          name="privacyAccepted"
          type="checkbox"
          required
          value="true"
          className="mt-1 size-4 accent-olive"
        />
        <span>
          He leído la{" "}
          <Link href="/politica-de-privacidad" className="underline">
            política de privacidad
          </Link>
          .
        </span>
      </label>
      <button
        type="submit"
        disabled={status === "sending"}
        className="min-h-11 self-start rounded-full bg-[#1E2B20] px-5 font-semibold text-white hover:bg-[#2A3C2D] disabled:opacity-60"
      >
        {status === "sending" ? "Enviando…" : "Enviar mensaje"}
      </button>
      {message && (
        <p
          role={status === "error" ? "alert" : "status"}
          className={`m-0 ${status === "error" ? "text-red-800" : "text-olive-dark"}`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
