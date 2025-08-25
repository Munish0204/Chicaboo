// components/Paypal.jsx
import React, { useEffect, useRef } from 'react';

const PayPalButton = ({ amount, currency, clientId, onSuccess, onClose }) => {
  const paypalRef = useRef();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}`;
    script.addEventListener('load', () => {
      if (window.paypal) {
        window.paypal.Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: amount,
                },
              }],
            });
          },
          onApprove: async (data, actions) => {
            const details = await actions.order.capture();
            onSuccess(details);
          },
          onCancel: onClose,
        }).render(paypalRef.current);
      }
    });

    document.body.appendChild(script);
  }, [amount, currency, clientId, onSuccess, onClose]);

  return <div ref={paypalRef}></div>;
};

export default PayPalButton;
