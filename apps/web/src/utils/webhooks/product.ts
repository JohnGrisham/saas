import { graphQLClient } from 'client';
import { Stripe } from 'stripe';
import { gql } from 'graphql-request';
import { isStripeProduct } from '../type-guards';
import { v4 } from 'uuid';

const update = async (stripe: Stripe, data: Stripe.Event.Data.Object) => {
  if (!isStripeProduct(data)) {
    throw new Error(
      'Unknown data type when processing product create/update event',
    );
  }

  let productResult: any;
  const price =
    typeof data.default_price === 'string'
      ? await stripe.prices.retrieve(data.default_price)
      : data.default_price;
  const features: any[] = JSON.parse(data.metadata.features ?? '[]');

  if (!price || !price.unit_amount_decimal) {
    throw new Error('Product requires a price');
  }

  if (!features || !features.length) {
    throw new Error('Product requires one or more features');
  }

  const existing = await graphQLClient.request(
    gql`
      query ExistingProduct($id: ID!) {
        product(id: $id) {
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
      id: data.metadata?.productId ?? '',
    },
  );

  if (!existing.product) {
    const { productCreate } = await graphQLClient.request(
      gql`
        mutation CreateProduct(
          $name: String!
          $price: String!
          $features: [ProductFeatureRelateProductFeatureCreateRelationInput!]!
        ) {
          productCreate(
            input: { name: $name, price: $price, features: $features }
          ) {
            product {
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
        }
      `,
      {
        name: data.name,
        price: price.unit_amount_decimal,
        features: features.map((f: any) => ({
          create: { name: f.name, description: f.description },
        })),
      },
    );

    productResult = productCreate.product;
  } else {
    const totalFeatures: any[] = features.concat(
      existing.product.features.edges.map(({ node }: any) => ({
        ...node,
      })),
    );

    const updatedFeatures: any[] = await Promise.all(
      totalFeatures.map(async (f) => {
        const isInExisting = existing.product.features.edges.find(
          ({ node }: any) => node.id === f.id,
        );

        const isInCurrent = !!features.find((current) => current.id === f.id);

        const existingFeature = isInExisting
          ? true
          : !!(
              await graphQLClient.request(
                gql`
                  query getFeature($id: ID!) {
                    feature(id: $id) {
                      id
                    }
                  }
                `,
                { id: f.id },
              )
            ).feature;

        if (isInCurrent && existingFeature) {
          return { link: f.id };
        }

        if (isInCurrent && !existingFeature) {
          return {
            create: { name: f.name, description: f.description },
          };
        }

        if (existingFeature && !isInCurrent) {
          return { unlink: f.id };
        }
      }),
    );

    const { productUpdate } = await graphQLClient.request(
      gql`
        mutation UpdateProduct(
          $id: ID!
          $name: String
          $price: String
          $features: [ProductFeatureRelateProductFeatureUpdateRelationInput!]
        ) {
          productUpdate(
            id: $id
            input: { name: $name, price: $price, features: $features }
          ) {
            product {
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
        }
      `,
      {
        id: data.metadata.productId,
        name: data.name,
        price: price.unit_amount_decimal,
        features: updatedFeatures,
      },
    );

    productResult = productUpdate.product;
  }

  await stripe.products.update(
    data.id,
    {
      metadata: {
        productId: productResult.id,
        features: JSON.stringify(
          productResult.features.edges.map(({ node }: any) => ({
            ...node,
          })),
        ),
      },
    },
    { idempotencyKey: `IGNORE_${v4()}` },
  );
};

const remove = async (data: Stripe.Event.Data.Object) => {
  if (!isStripeProduct(data)) {
    throw new Error('Unknown data type when processing product delete event');
  }

  if (data.metadata.productId) {
    await graphQLClient.request(
      gql`
        mutation DeleteProduct($id: ID!) {
          productDelete(id: $id) {
            deletedId
          }
        }
      `,
      {
        id: data.metadata.productId,
      },
    );
  }
};

export const ProductHandler = { remove, update };
