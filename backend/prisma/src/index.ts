import express from 'express';
import cors from 'cors';
import { prisma } from './prisma';

const app = express();
app.use(cors());
app.use(express.json());

// Exemple de route GET /animals
app.get('/animals', async (_req, res) => {
  const list = await prisma.animal.findMany();
  res.json(list);
});

// etc. pour POST, PUT, DELETE…

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API sur http://localhost:${PORT}`));
