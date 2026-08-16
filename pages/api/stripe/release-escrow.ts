import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import Stripe from 'stripe';
import { authOptions } from '../../../lib/auth';

const stripeSecret = process.env.STRIPE_SECRET;
const stripe = stripeSecret
  ? new Stripe(stripeSecret, { apiVersion: '2025-08-27.basil' })
  : null;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!stripe) {
    return res.status(500).json({ message: 'Missing STRIPE_SECRET' });
  }

  const { paymentIntentId } = req.body ?? {};
  if (typeof paymentIntentId !== 'string') {
    return res.status(400).json({ message: 'Missing paymentIntentId' });
  }

  const capturedIntent = await stripe.paymentIntents.capture(paymentIntentId);
  return res.status(200).json({
    payment_intent_id: capturedIntent.id,
    status: capturedIntent.status
  });
}
