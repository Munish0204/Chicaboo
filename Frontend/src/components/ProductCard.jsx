import { Heart, ShoppingCart } from 'lucide-react';

const ProductCard = ({ product, onAddToCart, onToggleWishlist }) => (
  <div className="bg-white shadow-md rounded-xl overflow-hidden relative group">
    <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />

    {/* Icons */}
    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <button
        onClick={() => onToggleWishlist(product)}
        className="bg-white p-1.5 rounded-full shadow hover:bg-pink-100"
        aria-label="Add to Wishlist"
      >
        <Heart className="w-5 h-5 text-pink-600" />
      </button>
      <button
        onClick={() => onAddToCart(product)}
        className="bg-white p-1.5 rounded-full shadow hover:bg-blue-100"
        aria-label="Add to Cart"
      >
        <ShoppingCart className="w-5 h-5 text-blue-600" />
      </button>
    </div>

    <div className="p-4">
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-600 mt-1">{product.price}</p>
    </div>
  </div>
);

export default ProductCard;
