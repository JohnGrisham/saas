import { NextApiRequest, NextApiResponse } from 'next';
import { processWebhooks } from 'payments-server';
import { graphQLClient } from 'client';
import { gql } from 'graphql-request';
import Stripe from 'stripe';
import { stripe as stripeObject } from '../../utils';

const relevantEvents = new Set([
  'product.created',
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

    await processWebhooks(req, res, stripe, async (event) => {
      if (relevantEvents.has(event.type)) {
        try {
          const customer = event.data.object as Stripe.Customer;
          const product = event.data.object as Stripe.Product;
          const subscription = event.data.object as Stripe.Subscription;

          switch (event.type) {
            case 'product.created':
            case 'product.updated':
              const price =
                typeof product.default_price === 'string'
                  ? await stripe.prices.retrieve(product.default_price)
                  : product.default_price;
              const features: [] = JSON.parse(
                product.metadata.features ?? '[]',
              );

              if (!price || !price.unit_amount_decimal) {
                throw new Error('Product requires a price');
              }

              if (!features || !features.length) {
                throw new Error('Product requires one or more features');
              }

              if (event.type === 'product.created') {
                const { productCreate } = await graphQLClient.request(
                  gql`
                    mutation CreateProduct(
                      $name: String
                      $price: String
                      $features: [Feature!]!
                    ) {
                      productCreate(
                        input: {
                          name: $name
                          price: $price
                          features: { create: $features }
                        }
                      ) {
                        product {
                          id
                        }
                      }
                    }
                  `,
                  {
                    name: product.name,
                    price: price.unit_amount_decimal,
                    features,
                  },
                );
                await stripe.products.update(product.id, {
                  metadata: { productId: productCreate.product.id },
                });
              } else {
                await graphQLClient.request(
                  gql`
                    mutation UpdateProduct(
                      $id: ID!
                      $name: String
                      $price: String
                      $features: [Feature!]!
                    ) {
                      productUpdate(
                        id: $id
                        input: {
                          name: $name
                          price: $price
                          features: { create: $features }
                        }
                      ) {
                        product {
                          id
                        }
                      }
                    }
                  `,
                  {
                    id: product.metadata.productId,
                    name: product.name,
                    price: price.unit_amount_decimal,
                    features,
                  },
                );
              }

              break;
            case 'product.deleted':
              await graphQLClient.request(
                gql`
                  mutation DeleteProduct($id: ID!) {
                    productDelete(id: $id) {
                      deletedId
                    }
                  }
                `,
                {
                  id: product.metadata.productId,
                },
              );
              break;
            case 'customer.created':
            case 'customer.updated':
              if (!customer.email) {
                throw new Error('Customer requires an email');
              }

              if (event.type === 'customer.created') {
                const { userCreate } = await graphQLClient.request(
                  gql`
                    mutation CreateUser(
                      $name: String
                      $email: String!
                      $sub: String
                      $type: String
                      $stripeId: String!
                    ) {
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
                    name: customer.name ?? undefined,
                    email: customer.email,
                    stripeId: customer.id,
                  },
                );
                await stripe.customers.update(customer.id, {
                  metadata: {
                    customerId: userCreate.user.customer.id,
                    userId: userCreate.user.id,
                  },
                });
              } else {
                await graphQLClient.request(
                  gql`
                    mutation UpdateUser(
                      $id: ID!
                      $name: String
                      $email: String!
                      $customerId: String!
                    ) {
                      userUpdate(
                        id: $id
                        input: {
                          name: $name
                          email: $email
                          customer: { link: $customerId }
                        }
                      ) {
                        user {
                          id
                        }
                      }
                    }
                  `,
                  {
                    id: customer.metadata.userId,
                    name: customer.name ?? undefined,
                    email: customer.email,
                    customerId: customer.metadata.customerId,
                  },
                );
              }

              break;
            case 'customer.deleted':
              await graphQLClient.request(
                gql`
                  mutation DeleteUser($id: ID!) {
                    userDelete(id: $id) {
                      deletedId
                    }
                  }
                `,
                {
                  id: customer.metadata.userId,
                },
              );
              break;
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
              const subscriptionCustomer =
                typeof subscription.customer === 'string'
                  ? await stripe.customers.retrieve(subscription.customer)
                  : subscription.customer;

              const subscriptionItems = typeof subscription.items
                .data as unknown as Stripe.SubscriptionItem[];

              const {
                price: { product: potentialProduct },
                quantity,
              } = subscriptionItems[0];

              const subscriptionProduct =
                typeof potentialProduct === 'string'
                  ? await stripe.products.retrieve(potentialProduct)
                  : potentialProduct;

              if (!subscriptionCustomer || subscriptionCustomer.deleted) {
                throw new Error('Subscription requires a customer');
              }

              if (!subscriptionProduct || subscriptionProduct.deleted) {
                throw new Error('Subscription requires a product');
              }

              if (!quantity) {
                throw new Error('Subscription requires a positive quantity');
              }

              if (event.type === 'customer.subscription.created') {
                const { subscriptionCreate } = await graphQLClient.request(
                  gql`
                    mutation CreateSubscription(
                      $customerId: String!
                      $productId: String!
                      $quantity: Int!
                      $status: SubStatus!
                      $startDate: Timestamp!
                      $endDate: Timestamp!
                      $trialStart: Timestamp
                      $trialEnd Timestamp
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
                        }
                      }
                    }
                  `,
                  {
                    customerId: subscriptionCustomer.metadata.customerId,
                    productId: subscriptionProduct.metadata.productId,
                    startDate: subscription.current_period_start,
                    endDate: subscription.current_period_end,
                    status: subscription.status.toUpperCase(),
                    trialStart: subscription.trial_start,
                    trialEnd: subscription.trial_end,
                    quantity,
                  },
                );
                await stripe.subscriptions.update(subscription.id, {
                  metadata: {
                    subscriptionId: subscriptionCreate.subscription.id,
                  },
                });
              } else {
                await graphQLClient.request(
                  gql`
                    mutation UpdateSubscription(
                      $id: ID!
                      $customerId: String!
                      $productId: String!
                      $quantity: Int!
                      $status: SubStatus!
                      $startDate: Timestamp!
                      $endDate: Timestamp!
                      $trialStart: Timestamp
                      $trialEnd Timestamp
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
                        }
                      }
                    }
                  `,
                  {
                    id: subscription.metadata.subscriptionId,
                    customerId: subscriptionCustomer.metadata.customerId,
                    productId: subscriptionProduct.metadata.productId,
                    startDate: subscription.current_period_start,
                    endDate: subscription.current_period_end,
                    status: subscription.status.toUpperCase(),
                    trialStart: subscription.trial_start,
                    trialEnd: subscription.trial_end,
                    quantity,
                  },
                );
              }

              break;
            case 'customer.subscription.deleted':
              await graphQLClient.request(
                gql`
                  mutation DeleteSubscription($id: ID!) {
                    subscriptionDelete(id: $id) {
                      deletedId
                    }
                  }
                `,
                {
                  id: subscription.metadata.subscriptionId,
                },
              );
              break;
            default:
              throw new Error('Unhandled relevant event!');
          }
        } catch (error) {
          console.log(error);
          return res
            .status(400)
            .send('Webhook error: "Webhook handler failed. View logs."');
        }
      }
    });

    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).send('Method Not Allowed');
    res.end();
  }
};

export default webhookHandler;
