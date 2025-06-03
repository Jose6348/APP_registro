const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: '*', // Em produção, você deve especificar os domínios permitidos
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Atlas connection
const uri = `mongodb+srv://jfalasco88:${process.env.MONGODB_PASSWORD}@cluster0.snsohpe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
const studentRoutes = require('./routes/students');
const medidaRoutes = require('./routes/medidas');
const sinalVitalRoutes = require('./routes/sinais-vitais');

app.use('/api/students', studentRoutes);
app.use('/api/medidas', medidaRoutes);
app.use('/api/sinais-vitais', sinalVitalRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
}); 