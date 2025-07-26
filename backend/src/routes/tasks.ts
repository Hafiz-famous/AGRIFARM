// src/routes/tasks.ts
import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

export default function tasksRoutes(prisma: PrismaClient) {
  const router = Router()

  // GET /tasks
  router.get('/', async (_req: Request, res: Response) => {
    const list = await prisma.task.findMany()
    res.json(list)
  })

  // POST /tasks
  router.post('/', async (req: Request, res: Response) => {
    const { title, description, dueDate } = req.body

    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'Le champ "title" est requis.' })
    }

    try {
      const created = await prisma.task.create({
        data: {
          title,
          description: description ?? undefined,
          dueDate: dueDate ? new Date(dueDate) : undefined,
        },
      })
      res.status(201).json(created)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Erreur création tâche.' })
    }
  })

  return router
}
