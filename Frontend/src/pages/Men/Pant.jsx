// src/pages/Men/Pant.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingCart } from 'lucide-react';

const Pant = () => {
  const [pants, setPants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { cartItems = [], addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPants = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/men/pants');
        setPants(res.data);
      } catch (err) {
        console.error('Error fetching pants:', err);
        setError('Failed to load pants.');
      } finally {
        setLoading(false);
      }
    };

    fetchPants();
  }, []);

  const isInCart = (productId) => cartItems.some(item => item._id === productId);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (!isInCart(product._id)) {
      addToCart(product);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading pants...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Men's Pants</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {pants.map((pant) => {
          const inCart = isInCart(pant._id);

          return (
            <div
              key={pant._id}
              className="border rounded-lg p-4 shadow hover:shadow-xl transition duration-200 relative cursor-pointer"
              onClick={() => navigate(`/pants/${pant._id}`)}
            >
              <button
                onClick={(e) => handleAddToCart(e, pant)}
                disabled={inCart}
                className={`absolute top-3 right-3 p-1 rounded-full bg-white shadow hover:bg-gray-100 focus:outline-none ${
                  inCart ? 'cursor-not-allowed opacity-50' : ''
                }`}
                aria-label={inCart ? 'Already in cart' : 'Add to cart'}
              >
                <ShoppingCart
                  size={20}
                  className={inCart ? 'text-green-600' : 'text-black'}
                />
              </button>

              <img
                src={pant.image}
                alt={pant.name}
                className="w-full h-56 object-cover rounded-md mb-4"
                loading="lazy"
              />
              <h3 className="text-lg font-semibold">{pant.name}</h3>
              <p className="text-gray-600">₹{pant.price}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/pants/${pant._id}`);
                }}
                className={`mt-4 px-4 py-2 rounded text-white ${
                  inCart ? 'bg-green-600 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
                }`}
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

export default Pant;
