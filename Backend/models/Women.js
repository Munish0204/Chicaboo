import mongoose from 'mongoose';

const womenProductSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['shoes', 'western', 'watches', 'ethnic', 'tshirts', 'topsbottom', 'outwear'],
  },
  name: { type: String, required: true, trim: true },
  image: { type: String, required: true },
  price: { type: String, required: true },
  location: { type: String },
  featured: { type: Boolean, default: false },
  stock: { type: Number, default: 0 },
  description: { type: String },
  reviews: [
    {
      user: String,
      rating: Number,
      comment: String,
      size: String,
    },
  ],
  ratings: { type: Number, default: 0 },
}, { timestamps: true });

// ✅ Corrected model check
const WomenProduct = mongoose.models.WomenProduct || mongoose.model('WomenProduct', womenProductSchema);

export default WomenProduct;
