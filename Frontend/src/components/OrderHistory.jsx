import React, { useEffect, useState } from 'react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = localStorage.getItem('userId');
      const res = await fetch(`http://localhost:8000/api/orders/${userId}`);
      const data = await res.json();
      setOrders(data);
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Order History</h1>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Date:</strong> {new Date(order.date).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Transaction ID:</strong> {order.transactionId}
              </p>
              <ul className="mb-2">
                {order.items.map((item, i) => (
                  <li key={i} className="text-sm">
                    {item.quantity}x {item.name} — ₹{item.price}
                  </li>
                ))}
              </ul>
              <p className="font-semibold">Total: ₹{order.total.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
