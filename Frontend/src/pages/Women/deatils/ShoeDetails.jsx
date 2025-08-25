import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SIZES = [3, 4, 5, 6, 7, 8, 9, 10];

const WomenShoeDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [shoe, setShoe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    const fetchShoe = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/women/shoes/${productId}`);
        setShoe(res.data);
      } catch (err) {
        console.error('Error fetching shoe:', err);
        setError(err.response?.data?.error || 'Failed to load shoe details.');
      } finally {
        setLoading(false);
      }
    };

    fetchShoe();
  }, [productId]);

  const discountedPrice = shoe?.discount
    ? (shoe.price - (shoe.price * shoe.discount) / 100).toFixed(2)
    : shoe?.price;

  const usToIndian = (usSize) => (usSize - 1).toFixed(1);

  if (loading) return <p className="text-center mt-10">Loading shoe...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!shoe) return <p className="text-center mt-10 text-gray-500">Shoe not found.</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="mb-6 text-blue-600 hover:underline">
        ← Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div
            className={`relative overflow-hidden rounded-lg shadow transition-transform duration-300 ${
              zoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
            }`}
            onMouseEnter={() => setZoomed(true)}
            onMouseLeave={() => setZoomed(false)}
          >
            <img
              src={shoe.image}
              alt={shoe.name}
              className="w-full h-[400px] object-cover"
            />
          </div>

          {shoe.images?.length > 0 && (
            <div className="flex gap-2 mt-4">
              {shoe.images.map((img, idx) => (
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
          <h1 className="text-3xl font-bold mb-2">{shoe.name}</h1>
          <p className="text-sm text-gray-500 mb-1">{shoe.brand || 'Brandless'}</p>

          <div className="text-xl mb-2">
            {shoe.discount ? (
              <>
                <span className="line-through text-gray-400 mr-2">₹{shoe.price}</span>
                <span className="text-green-600">₹{discountedPrice}</span>
              </>
            ) : (
              <span>₹{shoe.price}</span>
            )}
          </div>

          <p className="text-gray-600 mb-2">{shoe.description}</p>

          {shoe.highlights?.length > 0 && (
            <ul className="list-disc pl-5 text-sm text-gray-700 mb-4">
              {shoe.highlights.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          )}

          <p className="mb-1">Stock: {shoe.stock ?? 'N/A'}</p>
          <p className="mb-1">Color: {shoe.color || 'Default'}</p>
          <p className="mb-1">Material: {shoe.material || 'Unknown'}</p>
          <p className="mb-4">Location: {shoe.location ?? 'Unknown'}</p>

          <div className="mb-4">
            <p className="mb-1 font-medium">Select Size (Indian):</p>
            <div className="flex gap-2 flex-wrap">
              {SIZES.map((usSize) => {
                const indianSize = usToIndian(usSize);
                const isAvailable = shoe.availableSizes?.includes(usSize) ?? true;
                return (
                  <button
                    key={usSize}
                    disabled={!isAvailable}
                    onClick={() => setSelectedSize(indianSize)}
                    className={`px-3 py-1 rounded border 
                      ${selectedSize === indianSize ? 'bg-black text-white' : 'bg-white text-black'}
                      ${!isAvailable ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                    title={`Indian Size: ${indianSize}`}
                  >
                    {indianSize}
                  </button>
                );
              })}
            </div>
            {selectedSize && (
              <p className="mt-2 text-sm">Selected Size: Indian {selectedSize}</p>
            )}
          </div>
        </div>
      </div>

      {shoe.reviews?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
          <div className="space-y-4">
            {shoe.reviews.map((review, idx) => (
              <div key={idx} className="border p-4 rounded">
                <p className="font-bold">{review.user}</p>
                <p className="text-yellow-500">Rating: {review.rating}★</p>
                <p className="text-sm">{review.comment}</p>
                {review.size && (
                  <p className="text-xs text-gray-500">Size: {review.size}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WomenShoeDetail;
