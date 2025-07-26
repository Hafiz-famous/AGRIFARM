// src/routes/treatments.ts
import { Router, Request, Response } from 'express'
import prisma from '../prisma'

const router = Router()

// GET /treatments – lister tous les traitements
router.get('/', async (_req: Request, res: Response) => {
  try {
    const treatments = await prisma.treatment.findMany({
      include: { animal: true }
    })
    res.json(treatments)
  } catch (err) {
    console.error('❌ Erreur /treatments :', err)
    res.status(500).json({ error: 'Erreur lors de la récupération des traitements.' })
  }
})

// POST /treatments – ajouter un traitement
router.post('/', async (req: Request, res: Response) => {
  const { date, type, description, veterinarian, animalId } = req.body
  try {
    const treatment = await prisma.treatment.create({
      data: {
        date: date ? new Date(date) : undefined,
        type,
        description,
        veterinarian,
        animalId,
      },
    })
    res.status(201).json(treatment)
  } catch (err) {
    console.error('❌ Erreur POST /treatments :', err)
    res.status(500).json({ error: 'Erreur lors de l’ajout du traitement.' })
  }
})

export default router
