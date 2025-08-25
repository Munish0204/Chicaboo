import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: String,
  rating: Number,
  comment: String,
  size: String,
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: String,
  category: { type: String, required: true },
  location: String,
  featured: Boolean,
  stock: Number,
  description: String,
  reviews: [reviewSchema],
  ratings: { type: Number, default: 0 }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
