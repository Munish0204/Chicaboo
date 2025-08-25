import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import PayPalButton from './Paypal';

const Cart = () => {
  const { cart, increaseQty, decreaseQty, removeItem, totalPrice, clearCart } = useCart();
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePayPalSuccess = async (details) => {
    const order = {
      userId: localStorage.getItem('userId'), // Replace with actual auth ID logic if needed
      items: cart.map((item) => ({
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      })),
      total: totalPrice,
      transactionId: details.id,
      status: 'Paid',
      date: new Date().toISOString(),
    };

    try {
      await fetch('http://localhost:8000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      setPaymentSuccess(true);
      clearCart();
      alert(`Payment successful!\nTransaction ID: ${details.id}`);
    } catch (error) {
      console.error('Order saving failed', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between border-b pb-4"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h2 className="text-lg font-medium">{item.name}</h2>
                  <p className="text-sm text-gray-600">₹{item.price}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      onClick={() => decreaseQty(item._id)}
                      className="px-2 py-1 border rounded"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => increaseQty(item._id)}
                      className="px-2 py-1 border rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-700">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeItem(item._id)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="text-right">
            <p className="text-xl font-semibold mt-4">
              Total: ₹{totalPrice.toFixed(2)}
            </p>

            <div className="mt-6">
              <PayPalButton
                amount={(totalPrice / 80).toFixed(2)} // Convert INR to USD
                currency="USD"
                clientId={import.meta.env.VITE_PAYPAL_CLIENT_ID}
                onSuccess={handlePayPalSuccess}
                onClose={() => console.log('Payment cancelled')}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
