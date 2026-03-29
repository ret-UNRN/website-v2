import type { VercelRequest, VercelResponse } from '@vercel/node'
import { neon } from '@neondatabase/serverless'
import { Resend } from 'resend'

const sql = neon(process.env.STORAGE_DATABASE_URL!)
const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const { nombre, email, origen_tipo, institucion, nivel_programacion, intereses, interes_otro, motivacion } = req.body

  if (!nombre || !email || !origen_tipo || !institucion || !nivel_programacion) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' })
  }

  try {
    await sql`
      INSERT INTO inscripciones (nombre, email, origen_tipo, institucion, nivel_programacion, intereses, interes_otro, motivacion)
      VALUES (${nombre}, ${email}, ${origen_tipo}, ${institucion}, ${nivel_programacion}, ${intereses}, ${interes_otro || null}, ${motivacion || null})
    `

    const firstName = nombre.split(' ')[0]

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bienvenidx a retUNRN</title>
</head>
<body style="margin:0;padding:0;background-color:#0d0d0d;font-family:'Courier New',Courier,monospace;color:#e8e8e8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d0d0d;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:24px;">
              <p style="margin:0;font-size:11px;color:#666666;letter-spacing:2px;">// UNRN SEDE ANDINA · BARILOCHE</p>
              <h1 style="margin:8px 0 0;font-size:28px;font-weight:bold;color:#e8e8e8;letter-spacing:-0.5px;">
                ret<span style="color:#cc0000;">UNRN</span>
              </h1>
              <p style="margin:4px 0 0;font-size:11px;color:#666666;">Club de Programación</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="border-top:1px solid #2e2e2e;padding-bottom:28px;"></td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#1a1a1a;border:1px solid #2e2e2e;border-radius:6px;padding:28px;">

              <p style="margin:0 0 6px;font-size:12px;color:#666666;">
                $ welcome <span style="color:#cc0000;">${firstName}</span>
              </p>
              <h2 style="margin:0 0 20px;font-size:18px;font-weight:bold;color:#e8e8e8;">
                Ya sos parte del club.
              </h2>

              <p style="margin:0 0 16px;font-size:13px;color:#cccccc;line-height:1.7;">
                Tu inscripción fue recibida. Te vamos a ir notificando de las actividades del club — talleres, competencias, proyectos y todo lo que vaya surgiendo.
              </p>

              <!-- Info block -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#242424;border:1px solid #2e2e2e;border-radius:4px;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px;">
                    <p style="margin:0 0 8px;font-size:11px;color:#666666;">— tu inscripción</p>
                    <p style="margin:0 0 6px;font-size:12px;color:#e8e8e8;"><span style="color:#cc0000;">nombre</span>      ${nombre}</p>
                    <p style="margin:0 0 6px;font-size:12px;color:#e8e8e8;"><span style="color:#cc0000;">institución</span>  ${institucion}</p>
                    <p style="margin:0;font-size:12px;color:#e8e8e8;"><span style="color:#cc0000;">nivel</span>        ${nivel_programacion}</p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background-color:#cc0000;border-radius:4px;">
                    <a href="https://github.com/retunrn" style="display:inline-block;padding:10px 20px;font-size:12px;font-weight:bold;color:#ffffff;text-decoration:none;letter-spacing:0.5px;">
                      → github.com/retunrn
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:12px;color:#666666;line-height:1.6;">
                Cualquier consulta respondé este mail o escribinos a <span style="color:#cc0000;">info@retunrn.org</span>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:20px;">
              <p style="margin:0;font-size:11px;color:#444444;text-align:center;">
                ret<span style="color:#cc0000;">UNRN</span> · Anasagasti 1463, Bariloche, Río Negro · <a href="https://www.retunrn.org" style="color:#444444;">retunrn.org</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

    await resend.emails.send({
      from: 'retUNRN <miembros@retunrn.org>',
      to: email,
      replyTo: 'info@retunrn.org',
      subject: `Bienvenidx al club, ${firstName}!`,
      html,
      text: `Hola ${firstName}, ya sos parte de retUNRN. Te vamos a ir notificando de las actividades del club. Cualquier consulta escribinos a info@retunrn.org — retunrn.org`,
    })

    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error('Error en inscripción:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}
