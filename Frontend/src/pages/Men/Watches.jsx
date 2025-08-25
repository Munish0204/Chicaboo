import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingCart } from 'lucide-react';

const Watches = () => {
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { cartItems = [], addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWatches = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/men/watches');
        setWatches(res.data);
      } catch (err) {
        console.error('Error fetching watches:', err);
        setError('Failed to load watches.');
      } finally {
        setLoading(false);
      }
    };

    fetchWatches();
  }, []);

  const isInCart = (productId) =>
    cartItems.some(item => item._id === productId);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (!isInCart(product._id)) {
      addToCart(product);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading watches...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-end mb-6 items-center space-x-2">
        {/* Reserved for future cart icon display */}
      </div>

      <h2 className="text-2xl font-bold mb-6 text-center">Men's Watches</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {watches.map((watch) => {
          const inCart = isInCart(watch._id);

          return (
            <div
              key={watch._id}
              className="border rounded-lg p-4 shadow hover:shadow-xl transition duration-200 relative cursor-pointer"
              onClick={() => navigate(`/watches/${watch._id}`)}
            >
              <button
                onClick={(e) => handleAddToCart(e, watch)}
                disabled={inCart}
                className={`absolute top-3 right-3 p-1 rounded-full bg-white shadow hover:bg-gray-100 focus:outline-none ${
                  inCart ? 'cursor-not-allowed opacity-50' : ''
                }`}
                aria-label={inCart ? 'Already in cart' : 'Add to cart'}
                title={inCart ? 'Already in cart' : 'Add to cart'}
              >
                <ShoppingCart
                  size={20}
                  className={inCart ? 'text-green-600' : 'text-black'}
                />
              </button>

              <img
                src={watch.image}
                alt={watch.name}
                className="w-full h-56 object-cover rounded-md mb-4"
                loading="lazy"
              />
              <h3 className="text-lg font-semibold">{watch.name}</h3>
              <p className="text-gray-600">₹{watch.price}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!inCart) navigate(`/watches/${watch._id}`);
                }}
                className={`mt-4 px-4 py-2 rounded text-white ${
                  inCart ? 'bg-green-600 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
                }`}
                disabled={inCart}
              >
                {inCart ? 'In Cart' : 'View Details'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Watches;
