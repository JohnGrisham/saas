import type { User } from 'client';
import Stripe from 'stripe';

function toDateTime(secs: number) {
  return new Date(secs * 1000);
}

export default async function Resolver(user: User) {
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
    await stripe.customers.list({ email, limit: 1 })
  ).data;

  const subscriptionResults = (
    await stripe.subscriptions.list({
      customer: existingStripeUser?.id,
      limit: 1,
    })
  ).data;

  const subscriptions = await Promise.all(
    subscriptionResults.map(
      async ({
        cancel_at,
        canceled_at,
        created,
        current_period_start,
        current_period_end,
        default_payment_method,
        ...sub
      }) => {
        const cancelAt = cancel_at ? toDateTime(cancel_at) : null;
        const canceledAt = canceled_at ? toDateTime(canceled_at) : null;
        const createdAt = created ? toDateTime(created) : null;
        const currentPeriodStart = toDateTime(current_period_start);
        const currentPeriodEnd = toDateTime(current_period_end);
        const defaultPaymentMethod =
          typeof default_payment_method === 'object'
            ? default_payment_method
            : null;
        const items = await Promise.all(
          sub.items.data.map(async (item) => {
            if (typeof item.price.product === 'string') {
              const product = await stripe.products.retrieve(
                item.price.product,
              );
              item.price.product = product;
            }

            return item;
          }),
        );

        console.log(defaultPaymentMethod);

        return {
          ...sub,
          cancellationDetails: sub.cancellation_details,
          cancelAt,
          canceledAt,
          createdAt,
          currentPeriodStart,
          currentPeriodEnd,
          defaultPaymentMethod,
          items,
        };
      },
    ),
  );

  return {
    ...existingStripeUser,
    subscriptions,
  };
}
