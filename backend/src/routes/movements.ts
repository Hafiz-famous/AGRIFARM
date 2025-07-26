// src/routes/movements.ts
import { Router, Request, Response } from 'express'
import { MovementType } from '@prisma/client'
import prisma from '../prisma'

const router = Router()

// GET /movements – liste tous les mouvements
router.get('/', async (_req: Request, res: Response) => {
  try {
    const list = await prisma.movement.findMany({
      include: { animal: true }, // si tu veux les données de l'animal lié
    })
    return res.json(list)
  } catch (err) {
    console.error('❌ Erreur /movements :', err)
    return res.status(500).json({ error: 'Erreur lors de la récupération des mouvements.' })
  }
})

// GET /movements/incoming – mouvements entrants
router.get('/incoming', async (_req: Request, res: Response) => {
  try {
    const incoming = await prisma.movement.findMany({
      where: { type: MovementType.INCOMING },
      include: { animal: true },
    })
    return res.json(incoming)
  } catch (err) {
    console.error('❌ Erreur /movements/incoming :', err)
    return res.status(500).json({ error: 'Erreur lors de la récupération des mouvements entrants.' })
  }
})

// GET /movements/outgoing – mouvements sortants
router.get('/outgoing', async (_req: Request, res: Response) => {
  try {
    const outgoing = await prisma.movement.findMany({
      where: { type: MovementType.OUTGOING },
      include: { animal: true },
    })
    return res.json(outgoing)
  } catch (err) {
    console.error('❌ Erreur /movements/outgoing :', err)
    return res.status(500).json({ error: 'Erreur lors de la récupération des mouvements sortants.' })
  }
})

export default router
