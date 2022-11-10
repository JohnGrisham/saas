import {
  CustomerByIdQuery,
  CustomerByIdQueryVariables,
  MutationSubscriptionCreateArgs,
  MutationSubscriptionDeleteArgs,
  MutationSubscriptionUpdateArgs,
  Mutation,
  ProductByIdQuery,
  ProductByIdQueryVariables,
  SubStatus,
  graphQLClient,
} from 'client';
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

  const { customer: existingCustomer } = await graphQLClient.request<
    CustomerByIdQuery,
    CustomerByIdQueryVariables
  >(
    gql`
      query ExistingCustomer($id: ID!) {
        customer(by: { id: $id }) {
          id
        }
      }
    `,
    {
      id: subscriptionCustomer.metadata?.customerId ?? '',
    },
  );

  if (!existingCustomer) {
    throw new Error(
      `Could not find customer ${
        subscriptionCustomer.name ?? subscriptionCustomer.id
      }`,
    );
  }

  const { product: existingProduct } = await graphQLClient.request<
    ProductByIdQuery,
    ProductByIdQueryVariables
  >(
    gql`
      query ExistingProduct($id: ID!) {
        product(by: { id: $id }) {
          id
          features(first: 100) {
            edges {
              node {
                id
                name
                description
              }
            }
          }
        }
      }
    `,
    {
      id: subscriptionProduct.metadata?.productId ?? '',
    },
  );

  if (!existingProduct) {
    throw new Error(
      `Could not find product by name ${subscriptionProduct.name}`,
    );
  }

  const { subscriptionCreate } = await graphQLClient.request<
    Mutation,
    MutationSubscriptionCreateArgs
  >(
    gql`
      mutation CreateSubscription($input: SubscriptionCreateInput!) {
        subscriptionCreate(input: $input) {
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
      input: {
        customer: { link: subscriptionCustomer.metadata.customerId },
        product: { link: subscriptionProduct.metadata.productId },
        startDate: data.current_period_start,
        endDate: data.cancel_at,
        status: data.status.toUpperCase() as SubStatus,
        trialStart: data.trial_start,
        trialEnd: data.trial_end,
        quantity: data.quantity,
      },
    },
  );

  if (!subscriptionCreate?.subscription) {
    throw new Error(
      `Unable to get created subscription. The stripe subscription metadata was not updated.`,
    );
  }

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

  const { subscriptionUpdate } = await graphQLClient.request<
    Mutation,
    MutationSubscriptionUpdateArgs
  >(
    gql`
      mutation UpdateSubscription($id: ID!, $input: SubscriptionUpdateInput!) {
        subscriptionUpdate(by: { id: $id }, input: $input) {
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
      input: {
        customer: { link: data.metadata.customerId },
        product: { link: data.metadata.productId },
        startDate: data.current_period_start,
        endDate: data.cancel_at,
        status: data.status.toUpperCase() as SubStatus,
        trialStart: data.trial_start,
        trialEnd: data.trial_end,
        quantity: data.quantity,
      },
    },
  );

  if (!subscriptionUpdate?.subscription) {
    throw new Error(
      `Unable to get updated subscription. The stripe subscription metadata was not updated.`,
    );
  }

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
    await graphQLClient.request<Mutation, MutationSubscriptionDeleteArgs>(
      gql`
        mutation DeleteSubscription($id: ID!) {
          subscriptionDelete(by: { id: $id }) {
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
