// src/routes/paddocks.ts
import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

export default function createPaddocksRouter(prisma: PrismaClient) {
  const router = Router();

  // GET /paddocks – liste tous les enclos
  router.get(
    '/',
    async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const list = await prisma.paddock.findMany();
        return res.json(list);
      } catch (err) {
        next(err);
      }
    }
  );

  // GET /paddocks/:id – récupère un enclos par ID
  router.get(
    '/:id',
    async (req: Request, res: Response, next: NextFunction) => {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'ID invalide' });
      }
      try {
        const paddock = await prisma.paddock.findUnique({ where: { id } });
        if (!paddock) {
          return res.status(404).json({ error: 'Enclos non trouvé' });
        }
        return res.json(paddock);
      } catch (err) {
        next(err);
      }
    }
  );

  // POST /paddocks – créer un nouvel enclos
  router.post(
    '/',
    async (req: Request, res: Response, next: NextFunction) => {
      const { name, path } = req.body;
      // Validation des champs
      if (!name || typeof name !== 'string') {
        return res
          .status(400)
          .json({ error: 'Le champ "name" est requis et doit être une chaîne.' });
      }
      if (!path || !Array.isArray(path)) {
        return res
          .status(400)
          .json({ error: 'Le champ "path" est requis et doit être un tableau.' });
      }

      try {
        const created = await prisma.paddock.create({
          data: {
            name,
            path: path as Prisma.InputJsonValue,
          },
        });
        return res.status(201).json(created);
      } catch (err) {
        next(err);
      }
    }
  );

  // PUT /paddocks/:id – mettre à jour un enclos existant
  router.put(
    '/:id',
    async (req: Request, res: Response, next: NextFunction) => {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'ID invalide' });
      }
      const { name, path } = req.body;
      if (name !== undefined && typeof name !== 'string') {
        return res
          .status(400)
          .json({ error: 'Le champ "name" doit être une chaîne.' });
      }
      if (path !== undefined && !Array.isArray(path)) {
        return res
          .status(400)
          .json({ error: 'Le champ "path" doit être un tableau.' });
      }

      try {
        const updated = await prisma.paddock.update({
          where: { id },
          data: {
            ...(name !== undefined && { name }),
            ...(path !== undefined && { path: path as Prisma.InputJsonValue }),
          },
        });
        return res.json(updated);
      } catch (err: any) {
        // Prisma error si l'enclos n'existe pas
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === 'P2025'
        ) {
          return res.status(404).json({ error: 'Enclos non trouvé' });
        }
        next(err);
      }
    }
  );

  // DELETE /paddocks/:id – supprimer un enclos
  router.delete(
    '/:id',
    async (req: Request, res: Response, next: NextFunction) => {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'ID invalide' });
      }
      try {
        await prisma.paddock.delete({ where: { id } });
        return res.status(204).send();
      } catch (err: any) {
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === 'P2025'
        ) {
          return res.status(404).json({ error: 'Enclos non trouvé' });
        }
        next(err);
      }
    }
  );

  return router;
}
