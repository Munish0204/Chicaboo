import React, { createContext, useContext, useState, useMemo } from 'react';

const CartContext = createContext();

const cleanPrice = (price) => {
  if (typeof price === 'string') {
    return Number(price.replace(/[^\d.]/g, '')) || 0;
  }
  return Number(price) || 0;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prev,
          {
            ...product,
            quantity: 1,
            price: cleanPrice(product.price),
          },
        ];
      }
    });
  };

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  // Memoize totalPrice so it recalculates only when cart changes
  const totalPrice = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + cleanPrice(item.price) * item.quantity,
      0
    );
  }, [cart]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, increaseQty, decreaseQty, removeItem, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Export CartContext in case you want to use useContext(CartContext) directly
export { CartContext };

export const useCart = () => useContext(CartContext);
