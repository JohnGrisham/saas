import { name, version } from '../../../package.json';
import type { User } from 'client';
import Stripe from 'stripe';
//import { constructStripe } from 'payments-server';

export default async function Resolver(user: User) {
  const { email } = user;

  if (!email) return null;
  const stripe = new Stripe(
    process.env.STRIPE_SECRET_KEY_LIVE ?? process.env.STRIPE_SECRET_KEY ?? '',
    {
      // https://github.com/stripe/stripe-node#configuration
      apiVersion: '2022-11-15',
      // Register this as an official Stripe plugin.
      // https://stripe.com/docs/building-plugins#setappinfo
      appInfo: { name, version },
    },
  );

  //const stripe = constructStripe({ name, version });

  const [existingStripeUser = null] = (await stripe.customers.list({ email }))
    .data;

  return existingStripeUser;
}
