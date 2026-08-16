import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET;
const stripe = stripeSecret
  ? new Stripe(stripeSecret, { apiVersion: '2025-08-27.basil' })
  : null;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!stripe) {
    return res.status(500).json({ message: 'Missing STRIPE_SECRET' });
  }

  const { amount, currency } = req.body ?? {};
  if (!Number.isInteger(amount) || amount <= 0 || typeof currency !== 'string') {
    return res.status(400).json({ message: 'Invalid amount or currency' });
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: currency.toLowerCase(),
    capture_method: 'manual'
  });

  return res.status(200).json({
    client_secret: paymentIntent.client_secret,
    payment_intent_id: paymentIntent.id
  });
}
