import React, { useState } from 'react';
import { useShoppingCart } from 'use-shopping-cart';

const buttonStyles = {
  fontSize: '13px',
  textAlign: 'center',
  color: '#fff',
  outline: 'none',
  padding: '12px',
  boxShadow: '2px 5px 10px rgba(0,0,0,.1)',
  backgroundColor: 'rgb(255, 178, 56)',
  borderRadius: '6px',
  letterSpacing: '1.5px',
};

const Cart = () => {
  const [loading, setLoading] = useState(false);
  const { cartDetails, formattedTotalPrice, cartCount, clearCart } = useShoppingCart();

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const lineItems = Object.values(cartDetails).map(item => ({
        price: item.sku,
        quantity: item.quantity,
      }));

      if (lineItems.length === 0) {
        alert('Your cart is empty!');
        setLoading(false);
        return;
      }

      const response = await fetch('/.netlify/functions/createCheckoutSession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: lineItems }),
      });

      const session = await response.json();

      if (session.sessionId) {
        if (typeof window !== 'undefined') {
          const stripe = window.Stripe(process.env.GATSBY_STRIPE_PUBLISHABLE_KEY);
          await stripe.redirectToCheckout({ sessionId: session.sessionId });
        } else {
          console.error('Stripe.js not loaded');
        }
      } else {
        console.error('Checkout session creation failed');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p>Number of Items: {cartCount}</p>
      <p>Total: {formattedTotalPrice}</p>

      <button style={buttonStyles} disabled={loading} onClick={handleCheckout}>
        {loading ? 'Loading...' : 'Checkout'}
      </button>

      <button style={buttonStyles} onClick={clearCart}>
        Clear cart
      </button>
    </div>
  );
};

export default Cart;
