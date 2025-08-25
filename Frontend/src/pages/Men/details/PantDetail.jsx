// src/pages/Men/details/PantDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const PantDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [pant, setPant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    const fetchPant = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/men/pants/${productId}`);
        setPant(res.data);
      } catch (err) {
        console.error('Error fetching pant:', err);
        setError(err.response?.data?.error || 'Failed to load pant details.');
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchPant();
  }, [productId]);

  const discountedPrice =
    pant?.discount && pant?.price
      ? (pant.price - (pant.price * pant.discount) / 100).toFixed(2)
      : pant?.price;

  if (loading) return <p className="text-center mt-10">Loading pant...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!pant) return <p className="text-center mt-10 text-gray-500">Pant not found.</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="mb-6 text-blue-600 hover:underline">
        ← Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div
            className={`relative overflow-hidden rounded-lg shadow transition-transform duration-300 ${
              zoomed ? 'scale-105 cursor-zoom-out' : 'cursor-zoom-in'
            }`}
            onMouseEnter={() => setZoomed(true)}
            onMouseLeave={() => setZoomed(false)}
          >
            <img
              src={pant.image}
              alt={pant.name}
              className={`w-full h-[400px] object-cover transition-transform duration-300`}
            />
          </div>

          {pant.images?.length > 0 && (
            <div className="flex gap-2 mt-4">
              {pant.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Preview ${idx + 1}`}
                  className="w-16 h-16 object-cover rounded border"
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{pant.name}</h1>
          <p className="text-sm text-gray-500 mb-1">{pant.brand || 'Brandless'}</p>
          <div className="text-xl mb-2">
            {pant.discount ? (
              <>
                <span className="line-through text-gray-400 mr-2">₹{pant.price}</span>
                <span className="text-green-600">₹{discountedPrice}</span>
              </>
            ) : (
              <span>₹{pant.price}</span>
            )}
          </div>

          <p className="text-gray-600 mb-2">{pant.description}</p>

          {pant.highlights?.length > 0 && (
            <ul className="list-disc pl-5 text-sm text-gray-700 mb-4">
              {pant.highlights.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          )}

          <p className="mb-1">Stock: {pant.stock ?? 'N/A'}</p>
          <p className="mb-1">Color: {pant.color || 'Default'}</p>
          <p className="mb-1">Material: {pant.material || 'Unknown'}</p>
          <p className="mb-4">Location: {pant.location ?? 'Unknown'}</p>

          {/* Indian Sizes Display */}
          <div className="mb-4">
            <p className="mb-1 font-semibold">Available Sizes:</p>
            <div className="flex gap-2">
              {SIZES.map((size) => (
                <span
                  key={size}
                  className="px-3 py-1 border rounded bg-gray-200 text-gray-700 select-none"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {pant.reviews?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
          <div className="space-y-4">
            {pant.reviews.map((review, idx) => (
              <div key={idx} className="border p-4 rounded">
                <p className="font-bold">{review.user}</p>
                <p className="text-yellow-500">Rating: {review.rating}★</p>
                <p className="text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PantDetail;
