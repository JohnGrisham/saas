import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { Readable } from 'node:stream';

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export const processWebhooks = async (
  req: NextApiRequest,
  res: NextApiResponse,
  stripe: Stripe,
  handler: (event: Stripe.Event) => Promise<void>,
) => {
  try {
    if (req.method === 'POST') {
      const buf = await buffer(req);
      const sig = req.headers['stripe-signature'];
      const webhookSecret =
        process.env.STRIPE_WEBHOOK_SECRET_LIVE ??
        process.env.STRIPE_WEBHOOK_SECRET ??
        '';
      const event =
        webhookSecret && sig
          ? stripe.webhooks.constructEvent(buf, sig, webhookSecret)
          : null;

      if (!event) {
        return res.status(400).send(`Failed to construct webhook event`);
      }

      await handler(event);

      res.json({ received: true });
    } else {
      res.setHeader('Allow', 'POST');
      res.status(405).send('Method Not Allowed');
      res.end();
    }
  } catch (err) {
    res.status(400).send(err);
  }
};

export default processWebhooks;
