import type { User } from 'client';
import Stripe from 'stripe';

export default async function Resolver(user: User) {
  try {
    const { email } = user;

    if (!email) return null;
    const stripe = new Stripe(
      process.env.STRIPE_SECRET_KEY_LIVE ?? process.env.STRIPE_SECRET_KEY ?? '',
      {
        // https://github.com/stripe/stripe-node#configuration
        apiVersion: '2022-11-15',
      },
    );

    const [existingStripeUser = null] = (
      await stripe.customers.list({
        email,
        limit: 1,
        expand: ['data.subscriptions'],
      })
    ).data;

    const subscriptions = await Promise.all(
      existingStripeUser?.subscriptions?.data.map(async (sub) => {
        const items = (
          await stripe.subscriptionItems.list({
            subscription: sub.id,
            expand: ['data.price.product'],
          })
        ).data;
        return { ...sub, items: { data: items } };
      }) ?? [],
    );

    return {
      ...existingStripeUser,
      subscriptions: {
        data: subscriptions,
      },
    };
  } catch (err) {
    console.error(err);
  }
}
