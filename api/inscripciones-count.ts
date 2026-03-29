import type { VercelRequest, VercelResponse } from '@vercel/node'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.STORAGE_DATABASE_URL!)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  try {
    const rows = await sql`SELECT COUNT(*)::int AS total FROM inscripciones`
    return res.status(200).json({ total: rows[0].total })
  } catch (error) {
    console.error('Error al contar inscripciones:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}
