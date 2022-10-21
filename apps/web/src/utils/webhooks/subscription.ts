import { graphQLClient } from 'client';
import { Stripe } from 'stripe';
import { gql } from 'graphql-request';
import { isStripeSubscription } from 'core';
import { v4 } from 'uuid';

const create = async (stripe: Stripe, data: Stripe.Event.Data.Object) => {
  if (!isStripeSubscription(data)) {
    throw new Error(
      'Unknown data type when processing subscription create event',
    );
  }

  const subscriptionCustomer =
    typeof data.customer === 'string'
      ? await stripe.customers.retrieve(data.customer)
      : data.customer;

  const subscriptionProduct = await stripe.products.retrieve(
    data.plan.product as string,
  );

  if (!subscriptionCustomer?.id || subscriptionCustomer.deleted) {
    throw new Error('Subscription requires a customer');
  }

  if (!subscriptionProduct?.id || subscriptionProduct.deleted) {
    throw new Error('Subscription requires a product');
  }

  if (!data.quantity) {
    throw new Error('Subscription requires a positive quantity');
  }

  const { subscriptionCreate } = await graphQLClient.request(
    gql`
      mutation CreateSubscription(
        $customerId: ID!
        $productId: ID!
        $quantity: Int!
        $status: SubStatus!
        $startDate: Timestamp!
        $endDate: Timestamp!
        $trialStart: Timestamp
        $trialEnd: Timestamp
      ) {
        subscriptionCreate(
          input: {
            customer: { link: $customerId }
            product: { link: $productId }
            quantity: $quantity
            status: $status
            startDate: $startDate
            endDate: $endDate
            trialStart: $trialStart
            trialEnd: $trialEnd
          }
        ) {
          subscription {
            id
            customer {
              id
            }
            product {
              id
            }
          }
        }
      }
    `,
    {
      customerId: subscriptionCustomer.metadata.customerId,
      productId: subscriptionProduct.metadata.productId,
      startDate: data.current_period_start,
      endDate: data.cancel_at,
      status: data.status.toUpperCase(),
      trialStart: data.trial_start,
      trialEnd: data.trial_end,
      quantity: data.quantity,
    },
  );
  await stripe.subscriptions.update(
    data.id,
    {
      metadata: {
        customerId: subscriptionCreate.subscription.customer.id,
        productId: subscriptionCreate.subscription.product.id,
        subscriptionId: subscriptionCreate.subscription.id,
      },
    },
    { idempotencyKey: `IGNORE_${v4()}` },
  );
};

const update = async (stripe: Stripe, data: Stripe.Event.Data.Object) => {
  if (!isStripeSubscription(data)) {
    throw new Error(
      'Unknown data type when processing subscription update event',
    );
  }

  const { subscriptionUpdate } = await graphQLClient.request(
    gql`
      mutation UpdateSubscription(
        $id: ID!
        $customerId: ID!
        $productId: ID!
        $quantity: Int!
        $status: SubStatus!
        $startDate: Timestamp!
        $endDate: Timestamp!
        $trialStart: Timestamp
        $trialEnd: Timestamp
      ) {
        subscriptionUpdate(
          id: $id
          input: {
            customer: { link: $customerId }
            product: { link: $productId }
            quantity: $quantity
            status: $status
            startDate: $startDate
            endDate: $endDate
            trialStart: $trialStart
            trialEnd: $trialEnd
          }
        ) {
          subscription {
            id
            customer {
              id
            }
            product {
              id
            }
          }
        }
      }
    `,
    {
      id: data.metadata.subscriptionId,
      customerId: data.metadata.customerId,
      productId: data.metadata.productId,
      startDate: data.current_period_start,
      endDate: data.cancel_at,
      status: data.status.toUpperCase(),
      trialStart: data.trial_start,
      trialEnd: data.trial_end,
      quantity: data.quantity,
    },
  );

  await stripe.subscriptions.update(
    data.id,
    {
      metadata: {
        customerId: subscriptionUpdate.subscription.customer.id,
        subscriptionId: subscriptionUpdate.subscription.id,
        productId: subscriptionUpdate.subscription.product.id,
      },
    },
    { idempotencyKey: `IGNORE_${v4()}` },
  );
};

const remove = async (data: Stripe.Event.Data.Object) => {
  if (!isStripeSubscription(data)) {
    throw new Error(
      'Unknown data type when processing subscription delete event',
    );
  }

  if (data.metadata.subscriptionId) {
    await graphQLClient.request(
      gql`
        mutation DeleteSubscription($id: ID!) {
          subscriptionDelete(id: $id) {
            deletedId
          }
        }
      `,
      {
        id: data.metadata.subscriptionId,
      },
    );
  }
};

export const SubscriptionHandler = { create, update, remove };
