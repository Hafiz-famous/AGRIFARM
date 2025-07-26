import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

export default function paddockActionsRoutes(prisma: PrismaClient) {
  const router = Router()

  // GET /paddock-actions – liste toutes les actions
  router.get('/', async (_req: Request, res: Response) => {
    try {
      const actions = await prisma.paddockAction.findMany({
        include: { paddock: true }, // optionnel
      })
      res.json(actions)
    } catch (err) {
      console.error('❌ Erreur GET /paddock-actions:', err)
      res.status(500).json({ error: 'Erreur lors de la récupération des actions sur paddocks.' })
    }
  })

  // POST /paddock-actions – créer une action
  router.post('/', async (req: Request, res: Response) => {
    const { type, description, date, paddockId } = req.body

    if (!type || !paddockId) {
      return res.status(400).json({ error: 'Les champs "type" et "paddockId" sont requis.' })
    }

    try {
      const created = await prisma.paddockAction.create({
        data: {
          type,
          description: description ?? undefined,
          date: date ? new Date(date) : new Date(), // si absent, utilise now()
          paddockId: Number(paddockId),
        },
      })
      res.status(201).json(created)
    } catch (err) {
      console.error('❌ Erreur POST /paddock-actions:', err)
      res.status(500).json({ error: 'Erreur lors de la création de l’action.' })
    }
  })

  return router
}
