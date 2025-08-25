import express from 'express';
import mongoose from 'mongoose';
import WomenProduct from '../models/Women.js';

const router = express.Router();

const validCategories = [
  'shoes',
  'western',
  'watches',
  'ethnic',
  'tshirts',
  'topsbottom',
  'outwear',
];

// Example GET endpoint
router.get('/', (req, res) => {
  res.json({ message: 'Women route is working!' });
});

// ✅ GET all products by category
router.get('/:category', async (req, res) => {
  const { category } = req.params;

  if (!validCategories.includes(category)) {
    return res.status(404).json({ error: 'Category not found' });
  }

  try {
    const products = await WomenProduct.find({ category });
    res.status(200).json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// ✅ GET single product by ID
router.get('/:category/:productId', async (req, res) => {
  const { category, productId } = req.params;

  if (!validCategories.includes(category)) {
    return res.status(404).json({ error: 'Category not found' });
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  try {
    const product = await WomenProduct.findOne({ _id: productId, category });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error('Error fetching product by ID:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ POST new product
router.post('/:category', async (req, res) => {
  const { category } = req.params;

  if (!validCategories.includes(category)) {
    return res.status(404).json({ error: 'Category not found' });
  }

  const {
    name,
    image,
    price,
    location,
    featured = false,
    stock = 0,
    description = '',
    reviews = [],
    ratings = 0,
  } = req.body;

  if (!name || !image || !price) {
    return res.status(400).json({ error: 'Name, image, and price are required.' });
  }

  try {
    const newProduct = new WomenProduct({
      category,
      name,
      image,
      price,
      location,
      featured,
      stock,
      description,
      reviews,
      ratings,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error('Error saving product:', err);
    res.status(500).json({ error: 'Failed to save product' });
  }
});

export default router;
