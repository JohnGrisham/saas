import { graphQLClient } from 'client';
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

  const { user } = await graphQLClient.request(
    gql`
      query GetUserByEmail($email: Email!) {
        user(by: { email: $email }) {
          id
        }
      }
    `,
  );

  if (!user?.id) {
    throw new Error('Unable to find a user with this email');
  }

  const { customerCreate } = await graphQLClient.request(
    gql`
      mutation CreateUser($stripeId: String!, $userId: ID!) {
        customerCreate(
          input: { stripeId: $stripeId, user: { link: $userId } }
        ) {
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
      stripeId: data.id,
      userId: '',
    },
  );

  await stripe.customers.update(
    data.id,
    {
      metadata: {
        customerId: customerCreate.user.customer.id,
        userId: customerCreate.user.id,
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

  const { userUpdate } = await graphQLClient.request(
    gql`
      mutation UpdateUser(
        $id: ID!
        $name: String
        $email: Email!
        $customerId: ID!
      ) {
        userUpdate(
          id: $id
          input: { name: $name, email: $email, customer: { link: $customerId } }
        ) {
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
      id: data.metadata.userId,
      name: data.name ?? undefined,
      email: data.email,
      customerId: data.metadata.customerId,
    },
  );

  await stripe.customers.update(
    data.id,
    {
      metadata: {
        customerId: userUpdate.user.customer.id,
        userId: userUpdate.user.id,
      },
    },
    { idempotencyKey: `IGNORE_${v4()}` },
  );
};

const remove = async (data: Stripe.Event.Data.Object) => {
  if (!isStripeCustomer(data)) {
    throw new Error('Unknown data type when processing customer delete event');
  }

  if (data.metadata.userId) {
    await graphQLClient.request(
      gql`
        mutation DeleteCustomer($id: ID!) {
          customerDelete(id: $id) {
            deletedId
          }
        }
      `,
      {
        id: data.metadata.userId,
      },
    );
  }
};

export const CustomerHandler = { create, update, remove };
