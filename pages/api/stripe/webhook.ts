import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const stripe = stripeSecret
  ? new Stripe(stripeSecret, { apiVersion: '2025-08-27.basil' })
  : null;

export const config = {
  api: {
    bodyParser: false
  }
};

async function getRawBody(req: NextApiRequest) {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!stripe || !webhookSecret) {
    return res.status(500).json({ message: 'Missing Stripe webhook configuration' });
  }

  const signature = req.headers['stripe-signature'];
  if (!signature || typeof signature !== 'string') {
    return res.status(400).json({ message: 'Missing stripe-signature header' });
  }

  const rawBody = await getRawBody(req);

  try {
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

    if (
      event.type === 'payment_intent.succeeded' ||
      event.type === 'payment_intent.canceled'
    ) {
      // eslint-disable-next-line no-console
      console.log(`Stripe webhook received: ${event.type}`, event.data.object.id);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : 'Webhook signature verification failed'
    });
  }
}
