// src/routes/animals.ts
import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

export default function animalsRoutes(prisma: PrismaClient) {
  const router = Router()

  // GET /animals
  router.get('/', async (_req: Request, res: Response) => {
    try {
      const list = await prisma.animal.findMany()
      res.json(list)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Erreur lors de la récupération des animaux.' })
    }
  })

  // POST /animals
  router.post('/', async (req: Request, res: Response) => {
    const { name, species, weight, location } = req.body

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Le champ "name" est requis.' })
    }

    if (!species || typeof species !== 'string') {
      return res.status(400).json({ error: 'Le champ "species" est requis.' })
    }

    try {
      const created = await prisma.animal.create({
        data: {
          name,
          species,
          weight: weight != null ? Number(weight) : undefined,
          location: location ?? undefined,
        },
      })
      res.status(201).json(created)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Erreur lors de la création de l’animal.' })
    }
  })

  return router
}
