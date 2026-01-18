const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Redis connection
redisClient.connect()
  .then(() => console.log('Redis connected'))
  .catch(err => console.error('Redis connection error:', err));

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  category: String,
  stock: Number
});

const Product = mongoose.model('Product', productSchema);

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Backend API' });
});

// Get all products with caching
app.get('/api/products', async (req, res) => {
  try {
    const cached = await redisClient.get('products');
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const products = await Product.find();
    await redisClient.setEx('products', 300, JSON.stringify(products));
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add product
app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    await redisClient.del('products'); // Clear cache
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on port ${PORT}`);
});