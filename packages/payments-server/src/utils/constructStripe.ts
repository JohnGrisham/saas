import Stripe from 'stripe';

export const constructStripe = (appInfo: Stripe.AppInfo) =>
  new Stripe(
    process.env.STRIPE_SECRET_KEY_LIVE ?? process.env.STRIPE_SECRET_KEY ?? '',
    {
      // https://github.com/stripe/stripe-node#configuration
      apiVersion: '2022-08-01',
      // Register this as an official Stripe plugin.
      // https://stripe.com/docs/building-plugins#setappinfo
      appInfo,
    },
  );
