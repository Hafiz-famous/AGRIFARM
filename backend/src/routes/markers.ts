// src/routes/markers.ts
import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

export default function markersRoutes(prisma: PrismaClient) {
  const router = Router()

  /**
   * GET /markers
   * Récupère les paddocks avec leurs coordonnées (path)
   */
  router.get('/', async (_req: Request, res: Response) => {
    try {
      const markers = await prisma.paddock.findMany({
        select: {
          id: true,
          name: true,
          path: true,
        },
      })
      res.json(markers)
    } catch (err) {
      console.error('❌ Erreur GET /markers :', err)
      res.status(500).json({ error: 'Erreur lors de la récupération des marqueurs.' })
    }
  })

  return router
}
