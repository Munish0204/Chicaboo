import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Heart, Sun, Moon, Star, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

import menWear from '../assets/men wear.jpg';
import shoe from '../assets/shoe.jpg';
import womenWear from '../assets/women wear.jpg';
import watch from '../assets/watch.jpg';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedProducts, setLikedProducts] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Sample featured carousel
  const featured = [
    { _id: '1', name: 'Boys Wears', price: 1299, image: menWear },
    { _id: '2', name: 'Shoes', price: 1999, image: shoe },
    { _id: '3', name: 'Women Wears', price: 1499, image: womenWear },
    { _id: '4', name: 'Watches', price: 3499, image: watch },
  ];

  // Sample fallback products
  const sampleProducts = [
    { _id: '1', name: 'Premium T-Shirt', price: 899, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop' },
    { _id: '2', name: 'Designer Jeans', price: 2499, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop' },
    { _id: '3', name: 'Casual Sneakers', price: 3299, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop' },
    { _id: '4', name: 'Summer Dress', price: 1899, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop' },
    { _id: '5', name: 'Leather Jacket', price: 4999, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop' },
    { _id: '6', name: 'Sports Hoodie', price: 1599, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=300&fit=crop' },
  ];

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/products');
        setProducts(res.data.length ? res.data : sampleProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts(sampleProducts); // fallback
      }
    };
    fetchProducts();
  }, []);

  // Carousel auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === featured.length - 1 ? 0 : prev + 1));
    }, 2000);
    return () => clearInterval(interval);
  }, [featured.length]);

  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? featured.length - 1 : prev - 1));
  const nextSlide = () => setCurrentIndex((prev) => (prev === featured.length - 1 ? 0 : prev + 1));

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
  };

  const toggleLike = (e, productId) => {
    e.stopPropagation();
    setLikedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div className={`min-h-screen transition-all duration-700 ${darkMode 
      ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white' 
      : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-800'}`}>
      
      {/* Background animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-10 -left-10 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float ${darkMode ? 'bg-purple-400' : 'bg-purple-300'}`}></div>
        <div className={`absolute -bottom-10 -right-10 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-reverse ${darkMode ? 'bg-indigo-400' : 'bg-indigo-300'}`}></div>
        <div className={`absolute top-1/2 left-1/3 w-60 h-60 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse ${darkMode ? 'bg-pink-400' : 'bg-pink-300'}`}></div>
      </div>

      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleTheme}
          className={`relative w-16 h-8 rounded-full transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-opacity-30 transform hover:scale-110 ${darkMode ? 'bg-slate-700 focus:ring-purple-500' : 'bg-gray-300 focus:ring-indigo-500'}`}>
          <div className={`absolute top-1 left-1 w-6 h-6 rounded-full transition-all duration-500 transform flex items-center justify-center shadow-lg ${darkMode ? 'translate-x-8 bg-gradient-to-r from-purple-400 to-pink-400' : 'translate-x-0 bg-gradient-to-r from-yellow-400 to-orange-400'}`}>
            {darkMode ? <Moon className="w-3 h-3 text-white" /> : <Sun className="w-3 h-3 text-yellow-800" />}
          </div>
        </button>
      </div>

      {/* Carousel */}
      <section className="w-full relative">
        <div className="max-w-7xl mx-auto py-16 px-4 relative z-10">
          <div className="text-center mb-16 relative">
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <Sparkles className={`w-8 h-8 animate-pulse ${darkMode ? 'text-purple-300' : 'text-purple-500'}`} />
            </div>
            <h2 className={`text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r bg-clip-text text-transparent animate-fade-in-up ${darkMode ? 'from-white via-purple-200 to-pink-200' : 'from-gray-800 via-purple-600 to-pink-600'}`}>
              Welcome TO Chic-a-boo
            </h2>
            <p className={`text-xl md:text-2xl font-medium mb-10 animate-fade-in-up animation-delay-200 ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
              Style that speaks tradition with a modern twist. Shop the look!
            </p>
            <div className="flex justify-center space-x-2 animate-fade-in-up animation-delay-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-6 h-6 animate-pulse ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>

          {/* Carousel images */}
          <div className={`relative overflow-hidden rounded-3xl shadow-2xl h-[500px] backdrop-blur-xl border transition-all duration-700 animate-slide-up ${darkMode ? 'bg-white/5 border-white/10 shadow-purple-900/25' : 'bg-white/30 border-white/20 shadow-indigo-900/25'}`}>
            <div className="flex transition-transform duration-700 ease-in-out h-full" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {featured.map((product) => (
                <div key={product._id} className="min-w-full relative group">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute top-6 right-6 z-10">
                    <button type="button" onClick={(e) => handleAddToCart(e, product)} className={`relative p-3 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-110 hover:rotate-12 group ${darkMode ? 'bg-white/90 hover:bg-white text-purple-600 hover:text-purple-800' : 'bg-white/90 hover:bg-white text-blue-600 hover:text-blue-800'}`} aria-label="Add to cart">
                      <ShoppingCart className="w-6 h-6" />
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full animate-pulse"></div>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <button type="button" onClick={prevSlide} className={`absolute top-1/2 left-6 -translate-y-1/2 p-4 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-110 hover:-translate-x-2 ${darkMode ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' : 'bg-white/90 hover:bg-white text-gray-800 border border-white/30'}`} aria-label="Previous Slide">‹</button>
            <button type="button" onClick={nextSlide} className={`absolute top-1/2 right-6 -translate-y-1/2 p-4 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-110 hover:translate-x-2 ${darkMode ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' : 'bg-white/90 hover:bg-white text-gray-800 border border-white/30'}`} aria-label="Next Slide">›</button>

            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
              {featured.map((_, index) => (
                <button key={index} onClick={() => setCurrentIndex(index)} className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white scale-125 shadow-lg' : darkMode ? 'bg-white/40 hover:bg-white/60' : 'bg-white/60 hover:bg-white/80'}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        <div className="text-center mb-16">
          <h2 className={`text-4xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent ${darkMode ? 'from-white via-purple-200 to-pink-200' : 'from-gray-800 via-purple-600 to-pink-600'}`}>
            Our Amazing Products
          </h2>
          <p className={`text-lg ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>Discover the latest trends and timeless classics</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product, index) => {
            const isLiked = likedProducts.includes(product._id);
            return (
              <div key={product._id} className={`relative backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden transition-all duration-500 transform hover:scale-105 hover:-translate-y-4 cursor-pointer group animate-fade-in-up border ${darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white/30 border-white/20 hover:bg-white/50'}`} style={{ animationDelay: `${index * 0.1}s` }} onClick={() => navigate(`/product/${product._id}`)}>
                <div className="relative overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-3 right-3 flex flex-col space-y-2">
                    <button type="button" onClick={(e) => handleAddToCart(e, product)} className={`p-2.5 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-110 hover:rotate-12 ${darkMode ? 'bg-white/90 hover:bg-white text-purple-600' : 'bg-white/90 hover:bg-white text-blue-600'}`}><ShoppingCart className="w-5 h-5" /></button>
                    <button type="button" onClick={(e) => toggleLike(e, product._id)} className={`p-2.5 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-110 ${isLiked ? 'bg-red-500 text-white' : darkMode ? 'bg-white/90 hover:bg-white text-gray-600 hover:text-red-500' : 'bg-white/90 hover:bg-white text-gray-600 hover:text-red-500'}`}><Heart className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" /></button>
                  </div>
                  <div className="absolute top-3 left-3"><div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">Sale!</div></div>
                </div>

                <div className="p-6 text-center relative">
                  <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 group-hover:scale-105 ${darkMode ? 'text-white group-hover:text-purple-200' : 'text-gray-800 group-hover:text-purple-600'}`}>{product.name}</h3>
                  <p className={`text-2xl font-bold mb-4 ${darkMode ? 'text-purple-300' : 'text-blue-700'}`}>₹{product.price}</p>
                  <div className="flex justify-center space-x-1 mb-4">{[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : darkMode ? 'text-gray-600' : 'text-gray-300'}`} />)}</div>
                  <button onClick={(e) => handleAddToCart(e, product)} className={`w-full py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 ${darkMode ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'}`}>Quick Add ⚡</button>
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${darkMode ? 'bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10' : 'bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10'} rounded-3xl`}></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <style jsx>{`
        @keyframes float {0%,100%{transform:translateY(0px) rotate(0deg);}33%{transform:translateY(-30px) rotate(5deg);}66%{transform:translateY(-15px) rotate(-5deg);}}
        @keyframes float-reverse {0%,100%{transform:translateY(0px) rotate(0deg);}33%{transform:translateY(30px) rotate(-5deg);}66%{transform:translateY(15px) rotate(5deg);}}
        @keyframes fade-in-up {from {opacity: 0; transform: translateY(30px);} to {opacity: 1; transform: translateY(0);}}
        @keyframes slide-up {from {opacity: 0; transform: translateY(50px) scale(0.95);} to {opacity: 1; transform: translateY(0) scale(1);}}
        @keyframes bounce-in {0% { transform: scale(0.3); opacity: 0; } 50% { transform: scale(1.05); } 70% { transform: scale(0.9); } 100% { transform: scale(1); opacity: 1; }}
        .animate-float {animation: float 8s ease-in-out infinite;}
        .animate-float-reverse {animation: float-reverse 8s ease-in-out infinite;animation-delay: 2s;}
        .animate-fade-in-up {animation: fade-in-up 0.8s ease-out forwards;}
        .animate-slide-up {animation: slide-up 0.8s ease-out forwards;}
        .animate-bounce-in {animation: bounce-in 0.6s ease-out forwards;}
        .animation-delay-200 {animation-delay: 0.2s;}
        .animation-delay-400 {animation-delay: 0.4s;}
      `}</style>
    </div>
  );
};

export default Home;
