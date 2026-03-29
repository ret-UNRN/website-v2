import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const { nombre, email, tema, mensaje } = req.body

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' })
  }

  try {
    await resend.emails.send({
      from: 'retUNRN <miembros@retunrn.org>',
      to: 'info@retunrn.org',
      replyTo: email,
      subject: `[contacto] ${tema ?? 'consulta'} — ${nombre}`,
      text: `Nombre: ${nombre}\nEmail: ${email}\nTema: ${tema ?? '-'}\n\n${mensaje}`,
    })

    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error('Error al enviar mail:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}
