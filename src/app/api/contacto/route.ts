import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(10).max(5000),
  privacyAccepted: z.enum(["true", "on"]),
  website: z.string().max(0).optional(),
});

export async function POST(request: Request) {
  const payload: unknown = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Revisa los campos e inténtalo de nuevo." },
      { status: 400 },
    );
  }
  if (parsed.data.website) {
    return NextResponse.json({ message: "Mensaje recibido." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.CONTACT_TO_EMAIL;
  const sender = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !recipient || !sender) {
    return NextResponse.json(
      { message: "El formulario no está configurado para enviar correo todavía." },
      { status: 503 },
    );
  }

  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: sender,
      to: [recipient],
      reply_to: parsed.data.email,
      subject: `Consulta de NumeroSemanas: ${parsed.data.name}`,
      text: parsed.data.message,
    }),
  });
  if (!emailResponse.ok) {
    return NextResponse.json(
      { message: "No se pudo enviar el mensaje. Inténtalo más tarde." },
      { status: 502 },
    );
  }
  return NextResponse.json({ message: "Mensaje enviado correctamente." });
}
