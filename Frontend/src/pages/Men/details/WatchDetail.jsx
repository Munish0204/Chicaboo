import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const WatchDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [watch, setWatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    const fetchWatch = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/men/watches/${productId}`);
        setWatch(res.data);
      } catch (err) {
        console.error('Error fetching watch:', err);
        setError(err.response?.data?.error || 'Failed to load watch details.');
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchWatch();
  }, [productId]);

  const discountedPrice = watch?.discount
    ? (watch.price - (watch.price * watch.discount) / 100).toFixed(2)
    : watch?.price;

  if (loading) return <p className="text-center mt-10">Loading watch...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!watch) return <p className="text-center mt-10 text-gray-500">Watch not found.</p>;

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
              src={watch.image}
              alt={watch.name}
              className="w-full h-[400px] object-cover"
            />
          </div>
          {watch.images?.length > 0 && (
            <div className="flex gap-2 mt-4">
              {watch.images.map((img, idx) => (
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
          <h1 className="text-3xl font-bold mb-2">{watch.name}</h1>
          <p className="text-sm text-gray-500 mb-1">{watch.brand || 'Brandless'}</p>
          <div className="text-xl mb-2">
            {watch.discount ? (
              <>
                <span className="line-through text-gray-400 mr-2">₹{watch.price}</span>
                <span className="text-green-600">₹{discountedPrice}</span>
              </>
            ) : (
              <span>₹{watch.price}</span>
            )}
          </div>
          <p className="text-gray-600 mb-2">{watch.description}</p>

          {watch.highlights?.length > 0 && (
            <ul className="list-disc pl-5 text-sm text-gray-700 mb-4">
              {watch.highlights.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          )}

          <p className="mb-1">Stock: {watch.stock ?? 'N/A'}</p>
          <p className="mb-1">Color: {watch.color || 'Default'}</p>
          <p className="mb-1">Material: {watch.material || 'Unknown'}</p>
          <p className="mb-4">Location: {watch.location ?? 'Unknown'}</p>
        </div>
      </div>

      {watch.reviews?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
          <div className="space-y-4">
            {watch.reviews.map((review, idx) => (
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

export default WatchDetail;
