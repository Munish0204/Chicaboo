import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// US to Indian size conversion
const usToIndian = (usSize) => {
  const map = {
    S: "38",
    M: "40",
    L: "42",
    XL: "44",
  };
  return map[usSize] || usSize;
};

const SIZES = ["S", "M", "L", "XL"];

const OutwearDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    if (!productId) {
      setError("No product ID specified.");
      setLoading(false);
      return;
    }

    const fetchItem = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/women/outwear/${productId}`
        );
        setItem(res.data);
      } catch (err) {
        console.error("Error fetching outwear item:", err);
        setError(err.response?.data?.error || "Failed to load item details.");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [productId]);

  if (loading) return <p className="text-center mt-10">Loading item...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!item) return <p className="text-center mt-10 text-gray-500">Item not found.</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 hover:underline"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-[450px] object-cover rounded-lg shadow"
          />
          {item.images?.length > 0 && (
            <div className="flex gap-3 mt-5">
              {item.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Preview ${idx + 1}`}
                  className="w-20 h-20 object-cover rounded border cursor-pointer"
                  onClick={() => window.scrollTo(0, 0)}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-3">{item.name}</h1>
          <p className="text-sm text-gray-500 mb-2">{item.brand || "Brandless"}</p>
          <div className="text-2xl font-semibold mb-3">₹{item.price}</div>
          <p className="text-gray-700 mb-5 leading-relaxed">{item.description}</p>

          {item.highlights?.length > 0 && (
            <ul className="list-disc pl-6 text-sm text-gray-700 mb-6">
              {item.highlights.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          )}

          <p className="mb-1">Stock: {item.stock ?? "N/A"}</p>
          <p className="mb-1">Color: {item.color || "Default"}</p>
          <p className="mb-1">Material: {item.material || "Unknown"}</p>
          <p className="mb-6">Location: {item.location ?? "Unknown"}</p>

          <div className="mb-8">
            <p className="mb-2 font-medium text-lg">Select Size (Indian):</p>
            <div className="flex gap-3 flex-wrap">
              {SIZES.map((usSize) => {
                const indianSize = usToIndian(usSize);
                const isAvailable = item.availableSizes?.includes(usSize) ?? true;
                return (
                  <button
                    key={usSize}
                    disabled={!isAvailable}
                    onClick={() => setSelectedSize(indianSize)}
                    className={`px-4 py-2 rounded border transition 
                      ${selectedSize === indianSize
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-gray-300 hover:bg-gray-100"} 
                      ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                    title={`Indian Size: ${indianSize}`}
                  >
                    {indianSize}
                  </button>
                );
              })}
            </div>
            {selectedSize && (
              <p className="mt-3 text-sm text-gray-700">
                Selected Size: Indian {selectedSize}
              </p>
            )}
          </div>
        </div>
      </div>

      {item.reviews?.length > 0 && (
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6">Customer Reviews</h2>
          <div className="space-y-6">
            {item.reviews.map((review, idx) => (
              <div key={idx} className="border p-5 rounded shadow-sm bg-white">
                <p className="font-semibold text-lg">{review.user || "Anonymous"}</p>
                <p className="text-yellow-500 mb-1">
                  {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
                </p>
                <p className="text-gray-700 mb-2">{review.comment}</p>
                {review.size && (
                  <p className="text-xs text-gray-400">Size: {review.size}</p>
                )}
                <p className="text-xs text-gray-400 italic">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OutwearDetail;
