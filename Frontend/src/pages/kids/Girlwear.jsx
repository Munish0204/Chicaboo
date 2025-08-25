import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingCart } from 'lucide-react';

const KidsGirlwear = () => {
  const [girlwear, setGirlwear] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cartItems = [], addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGirlwear = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/kids/girlswear');
        setGirlwear(res.data);
      } catch (err) {
        console.error('Error fetching girlwear:', err);
        setError('Failed to load girlwear.');
      } finally {
        setLoading(false);
      }
    };

    fetchGirlwear();
  }, []);

  const isInCart = (productId) => cartItems.some(item => item._id === productId);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (!isInCart(product._id)) {
      addToCart(product);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading girlwear...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Girls Wear</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {girlwear.map((item) => {
          const inCart = isInCart(item._id);

          return (
            <div
              key={item._id}
              className="border rounded-lg p-4 shadow hover:shadow-xl transition relative cursor-pointer"
              onClick={() => navigate(`/kids/girlwear/${item._id}`)}
            >
              <button
                onClick={(e) => handleAddToCart(e, item)}
                disabled={inCart}
                className={`absolute top-3 right-3 p-2 rounded-full bg-white shadow hover:bg-gray-100 ${
                  inCart ? 'cursor-not-allowed opacity-50' : ''
                }`}
                title={inCart ? 'Already in cart' : 'Add to cart'}
              >
                <ShoppingCart
                  size={20}
                  className={inCart ? 'text-green-600' : 'text-black'}
                />
              </button>

              <img
                src={item.image}
                alt={item.name}
                className="w-full h-56 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-gray-600">₹{item.price}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/kids/girlwear/${item._id}`);
                }}
                className={`mt-4 px-4 py-2 rounded text-white w-full ${
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

export default KidsGirlwear;
