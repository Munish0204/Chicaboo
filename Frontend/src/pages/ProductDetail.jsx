import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review form states
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/products/${productId}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleStarClick = (rating) => setSelectedRating(rating);

  const handleReviewSubmit = async () => {
    if (!selectedRating || !reviewText || !selectedSize) {
      setSubmitError('Please select a rating, size, and write a review.');
      return;
    }

    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const reviewData = {
        rating: selectedRating,
        comment: reviewText,
        user: "Anonymous",  // Replace with auth user info if available
        size: selectedSize,
      };

      await axios.post(`http://localhost:8000/api/products/${productId}/reviews`, reviewData);

      // Refetch updated product with new review
      const res = await axios.get(`http://localhost:8000/api/products/${productId}`);
      setProduct(res.data);

      setSelectedRating(0);
      setReviewText('');
      setSelectedSize('');
      setSubmitSuccess('Review submitted successfully!');
    } catch (err) {
      console.error('Error submitting review:', err);
      setSubmitError('Failed to submit review.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!product) return <div className="p-8">No product found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <button
        className="mb-6 text-blue-600 underline"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-4">{product.name || 'Product Name'}</h1>

      <img
        src={product.image || 'https://via.placeholder.com/600x400?text=No+Image'}
        alt={product.name || 'Product image'}
        className="w-full max-h-96 object-contain mb-6"
      />

      <p className="text-xl font-semibold mb-2">Price: ₹{product.price ?? 'N/A'}</p>

      <div className="mb-4">
        <strong>Category:</strong> {product.category || 'N/A'}
      </div>

      <div className="mb-4">
        <strong>Location:</strong> {product.location || 'N/A'}
      </div>

      <div className="mb-4">
        <strong>Featured:</strong> {product.featured ? 'Yes' : 'No'}
      </div>

      <div className="mb-4">
        <strong>Stock:</strong> {product.stock ?? 'N/A'}
      </div>

      <div className="mb-4">
        <strong>Ratings:</strong> {product.ratings?.toFixed(1) ?? 'N/A'} ⭐
      </div>

      <div className="mb-4">
        <strong>Description:</strong> {product.description || 'No description available.'}
      </div>

      <div className="mb-6">
        <strong>Reviews:</strong>
        {product.reviews && product.reviews.length > 0 ? (
          <ul className="list-disc list-inside mt-2 space-y-2">
            {product.reviews.map((review, index) => (
              <li key={index} className="border p-3 rounded-md">
                <p><strong>User:</strong> {review.user}</p>
                <p><strong>Size:</strong> {review.size}</p>
                <p><strong>Rating:</strong> {review.rating} ⭐</p>
                <p>{review.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>

      <hr className="my-6" />

      <div className="mb-4">
        <strong>Select Size (Indian):</strong>
        <div className="flex gap-4 mt-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-4 py-2 border rounded ${
                selectedSize === size ? 'bg-blue-600 text-white' : 'bg-white text-black'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <strong>Rate this product:</strong>
        <div className="flex space-x-2 mt-1 cursor-pointer">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => handleStarClick(star)}
              style={{ fontSize: '24px', color: star <= selectedRating ? '#fbbf24' : '#d1d5db' }}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <textarea
          rows="4"
          placeholder="Write your review here..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="w-full p-3 border rounded resize-none"
        />
      </div>

      {submitError && <p className="mb-2 text-red-600">{submitError}</p>}
      {submitSuccess && <p className="mb-2 text-green-600">{submitSuccess}</p>}

      <button
        onClick={handleReviewSubmit}
        disabled={submitLoading}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {submitLoading ? 'Submitting...' : 'Submit Review'}
      </button>
    </div>
  );
};

export default ProductDetail;
