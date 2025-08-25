import mongoose from 'mongoose';

const kidProductSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['boyswear', 'girlswear'],
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

const KidProduct = mongoose.models.KidProduct || mongoose.model('KidProduct', kidProductSchema);

export default KidProduct;
