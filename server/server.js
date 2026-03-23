require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vijaykumar97dev_db_user:g4puNvlBa7tYnVb3@cluster.cwygnye.mongodb.net/?appName=CLUSTER';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Routes
const trucksRouter = require('./routes/trucks');
const clientsRouter = require('./routes/clients');
const loadingPlacesRouter = require('./routes/loadingPlaces');
const driversRouter = require('./routes/drivers');
const shipmentsRouter = require('./routes/shipments');
const invoicesRouter = require('./routes/invoices');

app.use('/api/trucks', trucksRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/loading-places', loadingPlacesRouter);
app.use('/api/drivers', driversRouter);
app.use('/api/shipments', shipmentsRouter);
app.use('/api/invoices', invoicesRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
