import mongoose from 'mongoose';

const menProductSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['shoes', 'pants', 'watches', 'shirts', 'tshirts', 'tracks', 'shorts', 'traditional'],
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  location: { type: String },
  featured: { type: Boolean, default: false },
  stock: { type: Number, default: 0 },
  description: { type: String },
  reviews: [{ 
    user: String,
    rating: Number,
    comment: String,
    size: String
  }],
  ratings: { type: Number, default: 0 },
}, { timestamps: true });

// Check if model is already compiled (to avoid OverwriteModelError)
const MenProduct = mongoose.models.MenProduct || mongoose.model('MenProduct', menProductSchema);

export default MenProduct;
