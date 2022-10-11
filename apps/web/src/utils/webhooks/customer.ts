import { graphQLClient } from 'client';
import { Stripe } from 'stripe';
import { gql } from 'graphql-request';
import { isStripeCustomer } from '../type-guards';
import { v4 } from 'uuid';

const create = async (stripe: Stripe, data: Stripe.Event.Data.Object) => {
  if (!isStripeCustomer(data)) {
    throw new Error('Unknown data type when processing customer create event');
  }

  if (!data.email) {
    throw new Error('Customer requires an email');
  }

  const { userCreate } = await graphQLClient.request(
    gql`
      mutation CreateUser($name: String, $email: Email!, $stripeId: String!) {
        userCreate(
          input: {
            name: $name
            email: $email
            customer: { create: { stripeId: $stripeId } }
          }
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
      name: data.name ?? undefined,
      email: data.email,
      stripeId: data.id,
    },
  );

  await stripe.customers.update(
    data.id,
    {
      metadata: {
        customerId: userCreate.user.customer.id,
        userId: userCreate.user.id,
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
        mutation DeleteUser($id: ID!) {
          userDelete(id: $id) {
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
