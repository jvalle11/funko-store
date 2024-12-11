const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  let items;

  try {
    items = req.body.items;
  } catch (err) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price: item.price,
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.URL}/success`,
      cancel_url: `${process.env.URL}/cancel`,
    });

    return res.status(200).json({ sessionId: session.id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
