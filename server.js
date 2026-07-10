const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://escar_esteban:escar098@cluster0.gyh4c8f.mongodb.net/';
const sampleUsers = require('./json.js');

app.use(express.json());

const userSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.Mixed, required: false },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  edad: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  perfil: { type: Object, default: {} },
  hobbies: { type: Array, default: [] }
}, {
  versionKey: false,
  timestamps: true
});

const User = mongoose.models.Usuario || mongoose.model('Usuario', userSchema, 'usuarios');

let memoryUsers = sampleUsers.map((user) => ({ ...user }));
let dbAvailable = false;

async function connectToDatabase() {
  try {
    await mongoose.connect(mongoUri, {
      dbName: 'BaseDeDatos',
      serverSelectionTimeoutMS: 5000
    });
    dbAvailable = true;
    console.log('Conexión a MongoDB establecida');
    await seedSampleUsers();
  } catch (error) {
    dbAvailable = false;
    console.warn('No se pudo conectar a MongoDB, usando datos en memoria:', error.message);
  }
}

async function seedSampleUsers() {
  const count = await User.countDocuments();
  if (count === 0) {
    await User.insertMany(sampleUsers);
  }
}

async function getUsers() {
  if (dbAvailable) {
    return User.find().lean();
  }

  return memoryUsers;
}

async function createUser(payload) {
  const newUser = {
    ...payload,
    _id: payload._id || Date.now(),
    perfil: payload.perfil || {},
    hobbies: payload.hobbies || []
  };

  if (dbAvailable) {
    const createdUser = await User.create(newUser);
    return createdUser.toObject();
  }

  memoryUsers.push(newUser);
  return newUser;
}

app.get('/', (req, res) => {
  res.json({
    message: 'API de usuarios activa',
    endpoints: [
      'GET /usuarios',
      'POST /usuarios'
    ]
  });
});

app.get('/usuarios', async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/usuarios', async (req, res) => {
  try {
    const { nombre, apellido, edad, email, password, perfil, hobbies } = req.body;

    if (!nombre || !apellido || !edad || !email || !password) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const createdUser = await createUser({ nombre, apellido, edad, email, password, perfil, hobbies });
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });
});
