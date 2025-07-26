// src/routes/feedings.ts
import { Router, Request, Response } from 'express'
import prisma from '../prisma'

const router = Router()

// GET /feedings – lister tous les enregistrements d'alimentation
router.get('/', async (_req: Request, res: Response) => {
  try {
    const feedings = await prisma.feeding.findMany({
      include: { animal: true }
    })
    res.json(feedings)
  } catch (err) {
    console.error('❌ Erreur /feedings :', err)
    res.status(500).json({ error: 'Erreur lors de la récupération des enregistrements d’alimentation.' })
  }
})

// POST /feedings – ajouter un enregistrement d'alimentation
router.post('/', async (req: Request, res: Response) => {
  const { date, type, quantity, notes, animalId } = req.body
  try {
    const feeding = await prisma.feeding.create({
      data: {
        date: date ? new Date(date) : undefined,
        type,
        quantity,
        notes,
        animalId,
      },
    })
    res.status(201).json(feeding)
  } catch (err) {
    console.error('❌ Erreur POST /feedings :', err)
    res.status(500).json({ error: 'Erreur lors de l’ajout de l’enregistrement d’alimentation.' })
  }
})

export default router
