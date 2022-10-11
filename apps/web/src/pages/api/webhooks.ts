import {
  CustomerHandler,
  ProductHandler,
  SubscriptionHandler,
} from '../../utils';
import { NextApiRequest, NextApiResponse } from 'next';
import { processWebhooks } from 'payments-server';
import { stripe as stripeObject } from '../../utils';

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvents = new Set([
  'product.updated',
  'product.deleted',
  'customer.created',
  'customer.updated',
  'customer.deleted',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
]);

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const stripe = stripeObject;

    return await processWebhooks(req, stripe, async (event) => {
      console.log(event.type, event.request);
      if (
        relevantEvents.has(event.type) &&
        !event.request?.idempotency_key?.match(new RegExp(/IGNORE/))?.length
      ) {
        try {
          const data = event.data.object;

          switch (event.type) {
            // Skipping the create event since the update event will trigger when a price is added anyway.
            case 'product.updated':
              await ProductHandler.update(stripe, data);
              break;
            case 'product.deleted':
              await ProductHandler.remove(data);
              break;
            case 'customer.created':
              await CustomerHandler.create(stripe, data);
              break;
            case 'customer.updated':
              await CustomerHandler.update(stripe, data);
              break;
            case 'customer.deleted':
              await CustomerHandler.remove(data);
              break;
            case 'customer.subscription.created':
              await SubscriptionHandler.create(stripe, data);
              break;
            case 'customer.subscription.updated':
              await SubscriptionHandler.update(stripe, data);
              break;
            case 'customer.subscription.deleted':
              await SubscriptionHandler.remove(data);
              break;
            default:
              throw new Error('Unhandled relevant event!');
          }

          res.json({ received: true });
        } catch (error) {
          console.log(error);
          return res
            .status(400)
            .send('Webhook error: "Webhook handler failed. View logs."');
        }
      } else {
        res
          .status(100)
          .send(
            'Idempotent or irrelevant event was ignored, no further action is required',
          );
      }
    });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).send('Method Not Allowed');
  }
};

export default webhookHandler;
