// agrifarm/backend/index.js
require('dotenv').config();

const express  = require('express');
const cors     = require('cors');
const jwt      = require('jsonwebtoken');
const bcrypt   = require('bcrypt');
const { InfluxDB, Point } = require('@influxdata/influxdb-client');

const app = express();
app.use(cors());
app.use(express.json());

// --- InfluxDB setup ---
const influx = new InfluxDB({
  url:   process.env.INFLUX_URL,
  token: process.env.INFLUX_TOKEN,
});
const writeApi = influx.getWriteApi(
  process.env.INFLUX_ORG,
  process.env.INFLUX_BUCKET
);
const queryApi = influx.getQueryApi(process.env.INFLUX_ORG);

// --- JWT / Auth setup ---
const SECRET     = process.env.JWT_SECRET || 'unePhraseSecrète';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// Middleware pour protéger les routes
function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant' });
  }
  const token = auth.split(' ')[1];
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Token invalide' });
  }
}

// --- Routes publiques ---

// Route d'enregistrement (optionnel)
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis.' });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    // Stocke email + hash en mémoire ou base
    // Ici pour l’exemple on les met dans des variables globales
    process.env.ADMIN_EMAIL = email;
    process.env.ADMIN_HASH  = hash;
    return res.status(201).json({ success: true, email });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Impossible d’enregistrer.' });
  }
});

// Route de login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  // Vérifie l’email + hash
  if (email !== process.env.ADMIN_EMAIL) {
    return res.status(401).json({ error: 'Utilisateur inconnu' });
  }
  const match = await bcrypt.compare(password, process.env.ADMIN_HASH);
  if (!match) {
    return res.status(401).json({ error: 'Mot de passe incorrect' });
  }
  // Génère le token
  const token = jwt.sign({ email }, SECRET, { expiresIn: EXPIRES_IN });
  return res.json({ token });
});

// --- Routes protégées ---

// POST animal
app.post('/api/animals', authenticate, async (req, res) => {
  const { id, weight, location } = req.body;
  if (!id || !weight || !location) {
    return res.status(400).json({ error: 'id, weight et location requis.' });
  }
  const p = new Point('animal')
    .tag('id', String(id))
    .floatField('weight', weight)
    .stringField('location', location);
  writeApi.writePoint(p);
  try {
    await writeApi.flush();
    return res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Impossible d’enregistrer.' });
  }
});

// GET animals
app.get('/api/animals', authenticate, async (req, res) => {
  const fluxQuery = `
    from(bucket:"${process.env.INFLUX_BUCKET}")
      |> range(start: -30d)
      |> filter(fn: (r) => r._measurement == "animal")
      |> pivot(
          rowKey:["_time"],
          columnKey: ["_field"],
          valueColumn: "_value"
      )
  `;
  const results = [];
  try {
    for await (const { values } of queryApi.iterateRows(fluxQuery)) {
      results.push({
        id:       values.id,
        weight:   values.weight,
        location: values.location,
        time:     values._time,
      });
    }
    return res.json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur de lecture des animaux.' });
  }
});

// GET/POST markers (exemple)
let markers = [];
app.post('/api/markers', authenticate, (req, res) => {
  const { lat, lng } = req.body;
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return res.status(400).json({ error: 'lat et lng requis.' });
  }
  markers.push({ lat, lng });
  return res.status(201).json({ lat, lng });
});
app.get('/api/markers', authenticate, (req, res) => {
  return res.json(markers);
});

// Movements (exemple)
app.get('/api/movements/incoming', authenticate, (req, res) => { /* ... */ });
app.get('/api/movements/outgoing', authenticate, (req, res) => { /* ... */ });

// Démarrage du serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API → http://localhost:${PORT}`));
