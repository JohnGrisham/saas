import {
  MutationCustomerCreateArgs,
  MutationCustomerDeleteArgs,
  MutationCustomerUpdateArgs,
  Mutation,
  UserByEmailQuery,
  UserByEmailQueryVariables,
  graphQLClient,
} from 'client';
import { Stripe } from 'stripe';
import { gql } from 'graphql-request';
import { isStripeCustomer } from 'core';
import { v4 } from 'uuid';

const create = async (stripe: Stripe, data: Stripe.Event.Data.Object) => {
  if (!isStripeCustomer(data)) {
    throw new Error('Unknown data type when processing customer create event');
  }

  if (!data.email) {
    throw new Error('Customer requires an email');
  }

  const { user } = await graphQLClient.request<
    UserByEmailQuery,
    UserByEmailQueryVariables
  >(
    gql`
      query GetUserByEmail($email: Email!) {
        user(by: { email: $email }) {
          id
        }
      }
    `,
    {
      email: data.email,
    },
  );

  if (!user?.id) {
    throw new Error('Unable to find a user with this email');
  }

  const { customerCreate } = await graphQLClient.request<
    Mutation,
    MutationCustomerCreateArgs
  >(
    gql`
      mutation CreateCustomer($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer {
            id
          }
        }
      }
    `,
    {
      input: {
        stripeId: data.id,
        user: { link: user.id },
      },
    },
  );

  if (!customerCreate?.customer) {
    throw Error(
      `Unable to get created customer. The stripe customer metadata was not updated.`,
    );
  }

  await stripe.customers.update(
    data.id,
    {
      metadata: {
        customerId: customerCreate.customer.id,
        userId: user.id,
      },
    },
    { idempotencyKey: `IGNORE_${v4()}` },
  );
};

const update = async (stripe: Stripe, data: Stripe.Event.Data.Object) => {
  if (!isStripeCustomer(data)) {
    throw new Error('Unknown data type when processing customer update event');
  }

  if (!data.email) {
    throw new Error('Customer requires an email');
  }

  const { user } = await graphQLClient.request<
    UserByEmailQuery,
    UserByEmailQueryVariables
  >(
    gql`
      query GetUserByEmail($email: Email!) {
        user(by: { email: $email }) {
          id
        }
      }
    `,
    {
      email: data.email,
    },
  );

  if (!user?.id) {
    throw new Error('Unable to find a user with this email');
  }

  const { customerUpdate } = await graphQLClient.request<
    Mutation,
    MutationCustomerUpdateArgs
  >(
    gql`
      mutation UpdateCustomer($id: ID!, $input: CustomerUpdateInput!) {
        customerUpdate(id: $id, input: $input) {
          user {
            id
            customer {
              id
            }
          }
        }
      }
    `,
    {
      id: data.metadata.customerId,
      input: {
        stripeId: data.id,
        subscriptions:
          data.subscriptions?.data
            ?.filter(({ metadata }) => metadata.subscriptionId)
            .map((sub) => ({
              link: sub.metadata.subscriptionId,
            })) ?? [],
        user: { link: user.id },
      },
    },
  );

  if (!customerUpdate?.customer) {
    throw Error(
      `Unable to get updated customer. The stripe customer metadata was not updated.`,
    );
  }

  await stripe.customers.update(
    data.id,
    {
      metadata: {
        customerId: customerUpdate.customer.id,
        userId: user.id,
      },
    },
    { idempotencyKey: `IGNORE_${v4()}` },
  );
};

const remove = async (data: Stripe.Event.Data.Object) => {
  if (!isStripeCustomer(data)) {
    throw new Error('Unknown data type when processing customer delete event');
  }

  if (data.metadata.customerId) {
    await graphQLClient.request<Mutation, MutationCustomerDeleteArgs>(
      gql`
        mutation DeleteCustomer($id: ID!) {
          customerDelete(id: $id) {
            deletedId
          }
        }
      `,
      {
        id: data.metadata.customerId,
      },
    );
  }
};

export const CustomerHandler = { create, update, remove };
