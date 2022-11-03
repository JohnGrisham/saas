import {
  Feature,
  FeatureEdge,
  FeatureByIdQuery,
  FeatureByNameQuery,
  FeatureByIdQueryVariables,
  FeatureByNameQueryVariables,
  Maybe,
  MutationProductCreateArgs,
  MutationProductDeleteArgs,
  MutationProductUpdateArgs,
  Mutation,
  Product,
  ProductByIdQuery,
  ProductByIdQueryVariables,
  graphQLClient,
} from 'client';
import { Stripe } from 'stripe';
import { gql } from 'graphql-request';
import { isStripeProduct } from 'core';
import { v4 } from 'uuid';

const update = async (stripe: Stripe, data: Stripe.Event.Data.Object) => {
  if (!isStripeProduct(data)) {
    throw new Error(
      'Unknown data type when processing product create/update event',
    );
  }

  let productResult: Maybe<Product> | undefined;

  const price =
    typeof data.default_price === 'string'
      ? await stripe.prices.retrieve(data.default_price)
      : data.default_price;
  const features: Feature[] = JSON.parse(data.metadata.features ?? '[]');

  if (!price || price.unit_amount === null) {
    throw new Error('Product requires a price');
  }

  if (!features || !features.length) {
    throw new Error('Product requires one or more features');
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
      id: data.metadata?.productId ?? '',
    },
  );

  if (!existingProduct) {
    const { productCreate } = await graphQLClient.request<
      Mutation,
      MutationProductCreateArgs
    >(
      gql`
        mutation CreateProduct($input: ProductCreateInput!) {
          productCreate(input: $input) {
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
        input: {
          name: data.name,
          price: (price.unit_amount / 100).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          }),
          features: await Promise.all(
            features.map(async (f) => {
              const { feature } = await graphQLClient.request<
                FeatureByNameQuery,
                FeatureByNameQueryVariables
              >(
                gql`
                  query getFeature($name: String!) {
                    feature(by: { name: $name }) {
                      id
                    }
                  }
                `,
                { name: f.name },
              );

              if (feature) {
                return {
                  link: feature.id,
                };
              }

              return {
                create: {
                  name: f.name,
                  description: f.description,
                },
              };
            }),
          ),
        },
      },
    );

    productResult = productCreate?.product;
  } else {
    const totalFeatures: any[] = features.concat(
      existingProduct?.features?.edges
        ?.filter(
          (feature) =>
            feature && !features.find((f) => f.name === feature.node.name),
        )
        .map((feature) => {
          const { node } = feature as FeatureEdge;

          return {
            ...node,
          };
        }) ?? [],
    );

    const updatedFeatures: any[] = await Promise.all(
      totalFeatures.map(async (f) => {
        const isInExisting = existingProduct?.features?.edges
          ?.filter((feature) => feature)
          .find((feature) => {
            const { node } = feature as FeatureEdge;
            return node.id === f.id;
          });

        const isInCurrent = !!features.find((current) => current.id === f.id);

        const existingFeature = isInExisting
          ? true
          : !!(
              await graphQLClient.request<
                FeatureByIdQuery,
                FeatureByIdQueryVariables
              >(
                gql`
                  query getFeature($id: ID!) {
                    feature(by: { id: $id }) {
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

    const { productUpdate } = await graphQLClient.request<
      Mutation,
      MutationProductUpdateArgs
    >(
      gql`
        mutation UpdateProduct($id: ID!, $input: ProductUpdateInput!) {
          productUpdate(by: { id: $id }, input: $input) {
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
        input: {
          name: data.name,
          price: (price.unit_amount / 100).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          }),
          features: updatedFeatures,
        },
      },
    );

    productResult = productUpdate?.product;
  }

  if (!productResult) {
    throw new Error(
      `Unable to get updated product. The stripe product metadata was not updated.`,
    );
  }

  await stripe.products.update(
    data.id,
    {
      metadata: {
        productId: productResult.id,
        features: JSON.stringify(
          productResult?.features?.edges
            ?.filter((feature) => feature)
            .map((feature) => {
              const { node } = feature as FeatureEdge;

              return {
                ...node,
              };
            }),
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
    await graphQLClient.request<Mutation, MutationProductDeleteArgs>(
      gql`
        mutation DeleteProduct($id: ID!) {
          productDelete(by: { id: $id }) {
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
