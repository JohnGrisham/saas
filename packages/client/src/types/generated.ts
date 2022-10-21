import { GraphQLClient } from 'graphql-request';
import { RequestInit } from 'graphql-request/dist/types.dom';
import { useQuery, UseQueryOptions } from 'react-query';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

function fetcher<TData, TVariables>(client: GraphQLClient, query: string, variables?: TVariables, headers?: RequestInit['headers']) {
  return async (): Promise<TData> => client.request<TData, TVariables>(query, variables, headers);
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  Email: string;
  Timestamp: any;
};

export type Customer = {
  __typename?: 'Customer';
  /** when the model was created */
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  stripeId: Scalars['String'];
  subscription?: Maybe<Subscription>;
  /** when the model was updated */
  updatedAt: Scalars['DateTime'];
  user: User;
};

export type CustomerByInput = {
  id?: InputMaybe<Scalars['ID']>;
  stripeId?: InputMaybe<Scalars['String']>;
};

export type CustomerConnection = {
  __typename?: 'CustomerConnection';
  edges?: Maybe<Array<Maybe<CustomerEdge>>>;
  /** Information to aid in pagination */
  pageInfo: PageInfo;
};

/** Input to create a new Customer */
export type CustomerCreateInput = {
  stripeId: Scalars['String'];
  subscription?: InputMaybe<CustomerCustomerRelateSubscriptionSubscriptionCreateRelationInput>;
  user: CustomerCustomerRelateUserUserCreateRelationInput;
};

export type CustomerCreatePayload = {
  __typename?: 'CustomerCreatePayload';
  customer?: Maybe<Customer>;
};

/** Input to create a new CustomerCustomerRelateSubscriptionSubscription */
export type CustomerCustomerRelateSubscriptionSubscriptionCreateInput = {
  endDate?: InputMaybe<Scalars['Timestamp']>;
  product: SubscriptionProductRelateSubscriptionProductCreateInput;
  quantity: Scalars['Int'];
  startDate: Scalars['Timestamp'];
  status: SubStatus;
  trialEnd?: InputMaybe<Scalars['Timestamp']>;
  trialStart?: InputMaybe<Scalars['Timestamp']>;
};

/** Input to create a new CustomerCustomerRelateSubscriptionSubscription relation */
export type CustomerCustomerRelateSubscriptionSubscriptionCreateRelationInput = {
  create?: InputMaybe<CustomerCustomerRelateSubscriptionSubscriptionCreateInput>;
  link?: InputMaybe<Scalars['ID']>;
};

/** Input to update a CustomerCustomerRelateSubscriptionSubscription relation */
export type CustomerCustomerRelateSubscriptionSubscriptionUpdateRelationInput = {
  create?: InputMaybe<CustomerCustomerRelateSubscriptionSubscriptionCreateInput>;
  link?: InputMaybe<Scalars['ID']>;
  unlink?: InputMaybe<Scalars['ID']>;
};

/** Input to create a new CustomerCustomerRelateUserUser */
export type CustomerCustomerRelateUserUserCreateInput = {
  email: Scalars['Email'];
  identities?: InputMaybe<Array<UserIdentityRelateUserIdentityCreateInput>>;
  name?: InputMaybe<Scalars['String']>;
};

/** Input to create a new CustomerCustomerRelateUserUser relation */
export type CustomerCustomerRelateUserUserCreateRelationInput = {
  create?: InputMaybe<CustomerCustomerRelateUserUserCreateInput>;
  link?: InputMaybe<Scalars['ID']>;
};

/** Input to update a CustomerCustomerRelateUserUser relation */
export type CustomerCustomerRelateUserUserUpdateRelationInput = {
  create?: InputMaybe<CustomerCustomerRelateUserUserCreateInput>;
  link?: InputMaybe<Scalars['ID']>;
  unlink?: InputMaybe<Scalars['ID']>;
};

export type CustomerDeletePayload = {
  __typename?: 'CustomerDeletePayload';
  deletedId: Scalars['ID'];
};

export type CustomerEdge = {
  __typename?: 'CustomerEdge';
  cursor: Scalars['String'];
  node: Customer;
};

/** Input to create a new Customer */
export type CustomerUpdateInput = {
  stripeId?: InputMaybe<Scalars['String']>;
  subscription?: InputMaybe<CustomerCustomerRelateSubscriptionSubscriptionUpdateRelationInput>;
  user?: InputMaybe<CustomerCustomerRelateUserUserUpdateRelationInput>;
};

export type CustomerUpdatePayload = {
  __typename?: 'CustomerUpdatePayload';
  customer?: Maybe<Customer>;
};

export type Feature = {
  __typename?: 'Feature';
  /** when the model was created */
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  /** when the model was updated */
  updatedAt: Scalars['DateTime'];
};

export type FeatureByInput = {
  id?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
};

export type FeatureConnection = {
  __typename?: 'FeatureConnection';
  edges?: Maybe<Array<Maybe<FeatureEdge>>>;
  /** Information to aid in pagination */
  pageInfo: PageInfo;
};

/** Input to create a new Feature */
export type FeatureCreateInput = {
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

export type FeatureCreatePayload = {
  __typename?: 'FeatureCreatePayload';
  feature?: Maybe<Feature>;
};

export type FeatureDeletePayload = {
  __typename?: 'FeatureDeletePayload';
  deletedId: Scalars['ID'];
};

export type FeatureEdge = {
  __typename?: 'FeatureEdge';
  cursor: Scalars['String'];
  node: Feature;
};

/** Input to create a new Feature */
export type FeatureUpdateInput = {
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type FeatureUpdatePayload = {
  __typename?: 'FeatureUpdatePayload';
  feature?: Maybe<Feature>;
};

export type Identity = {
  __typename?: 'Identity';
  /** when the model was created */
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  sub: Scalars['String'];
  type: IdentityType;
  /** when the model was updated */
  updatedAt: Scalars['DateTime'];
  user: User;
};

export type IdentityByInput = {
  id?: InputMaybe<Scalars['ID']>;
  sub?: InputMaybe<Scalars['String']>;
};

export type IdentityConnection = {
  __typename?: 'IdentityConnection';
  edges?: Maybe<Array<Maybe<IdentityEdge>>>;
  /** Information to aid in pagination */
  pageInfo: PageInfo;
};

/** Input to create a new Identity */
export type IdentityCreateInput = {
  sub: Scalars['String'];
  type: IdentityType;
  user: IdentityIdentityRelateUserUserCreateRelationInput;
};

export type IdentityCreatePayload = {
  __typename?: 'IdentityCreatePayload';
  identity?: Maybe<Identity>;
};

export type IdentityDeletePayload = {
  __typename?: 'IdentityDeletePayload';
  deletedId: Scalars['ID'];
};

export type IdentityEdge = {
  __typename?: 'IdentityEdge';
  cursor: Scalars['String'];
  node: Identity;
};

/** Input to create a new IdentityIdentityRelateUserUser */
export type IdentityIdentityRelateUserUserCreateInput = {
  customer?: InputMaybe<UserCustomerRelateUserCustomerCreateInput>;
  email: Scalars['Email'];
  name?: InputMaybe<Scalars['String']>;
};

/** Input to create a new IdentityIdentityRelateUserUser relation */
export type IdentityIdentityRelateUserUserCreateRelationInput = {
  create?: InputMaybe<IdentityIdentityRelateUserUserCreateInput>;
  link?: InputMaybe<Scalars['ID']>;
};

/** Input to update a IdentityIdentityRelateUserUser relation */
export type IdentityIdentityRelateUserUserUpdateRelationInput = {
  create?: InputMaybe<IdentityIdentityRelateUserUserCreateInput>;
  link?: InputMaybe<Scalars['ID']>;
  unlink?: InputMaybe<Scalars['ID']>;
};

export enum IdentityType {
  Credentials = 'CREDENTIALS',
  Github = 'GITHUB'
}

/** Input to create a new Identity */
export type IdentityUpdateInput = {
  sub?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<IdentityType>;
  user?: InputMaybe<IdentityIdentityRelateUserUserUpdateRelationInput>;
};

export type IdentityUpdatePayload = {
  __typename?: 'IdentityUpdatePayload';
  identity?: Maybe<Identity>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Create a Customer */
  customerCreate?: Maybe<CustomerCreatePayload>;
  /** Delete a Customer by ID */
  customerDelete?: Maybe<CustomerDeletePayload>;
  /** Update a Customer */
  customerUpdate?: Maybe<CustomerUpdatePayload>;
  /** Create a Feature */
  featureCreate?: Maybe<FeatureCreatePayload>;
  /** Delete a Feature by ID */
  featureDelete?: Maybe<FeatureDeletePayload>;
  /** Update a Feature */
  featureUpdate?: Maybe<FeatureUpdatePayload>;
  /** Create a Identity */
  identityCreate?: Maybe<IdentityCreatePayload>;
  /** Delete a Identity by ID */
  identityDelete?: Maybe<IdentityDeletePayload>;
  /** Update a Identity */
  identityUpdate?: Maybe<IdentityUpdatePayload>;
  /** Create a Product */
  productCreate?: Maybe<ProductCreatePayload>;
  /** Delete a Product by ID */
  productDelete?: Maybe<ProductDeletePayload>;
  /** Update a Product */
  productUpdate?: Maybe<ProductUpdatePayload>;
  /** Create a Subscription */
  subscriptionCreate?: Maybe<SubscriptionCreatePayload>;
  /** Delete a Subscription by ID */
  subscriptionDelete?: Maybe<SubscriptionDeletePayload>;
  /** Update a Subscription */
  subscriptionUpdate?: Maybe<SubscriptionUpdatePayload>;
  /** Create a User */
  userCreate?: Maybe<UserCreatePayload>;
  /** Delete a User by ID */
  userDelete?: Maybe<UserDeletePayload>;
  /** Update a User */
  userUpdate?: Maybe<UserUpdatePayload>;
};


export type MutationCustomerCreateArgs = {
  input: CustomerCreateInput;
};


export type MutationCustomerDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationCustomerUpdateArgs = {
  id: Scalars['ID'];
  input: CustomerUpdateInput;
};


export type MutationFeatureCreateArgs = {
  input: FeatureCreateInput;
};


export type MutationFeatureDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationFeatureUpdateArgs = {
  id: Scalars['ID'];
  input: FeatureUpdateInput;
};


export type MutationIdentityCreateArgs = {
  input: IdentityCreateInput;
};


export type MutationIdentityDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationIdentityUpdateArgs = {
  id: Scalars['ID'];
  input: IdentityUpdateInput;
};


export type MutationProductCreateArgs = {
  input: ProductCreateInput;
};


export type MutationProductDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationProductUpdateArgs = {
  id: Scalars['ID'];
  input: ProductUpdateInput;
};


export type MutationSubscriptionCreateArgs = {
  input: SubscriptionCreateInput;
};


export type MutationSubscriptionDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationSubscriptionUpdateArgs = {
  id: Scalars['ID'];
  input: SubscriptionUpdateInput;
};


export type MutationUserCreateArgs = {
  input: UserCreateInput;
};


export type MutationUserDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationUserUpdateArgs = {
  id: Scalars['ID'];
  input: UserUpdateInput;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

export type Product = {
  __typename?: 'Product';
  /** when the model was created */
  createdAt: Scalars['DateTime'];
  features?: Maybe<FeatureConnection>;
  id: Scalars['ID'];
  name: Scalars['String'];
  price: Scalars['String'];
  /** when the model was updated */
  updatedAt: Scalars['DateTime'];
};


export type ProductFeaturesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type ProductByInput = {
  id?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
};

export type ProductConnection = {
  __typename?: 'ProductConnection';
  edges?: Maybe<Array<Maybe<ProductEdge>>>;
  /** Information to aid in pagination */
  pageInfo: PageInfo;
};

/** Input to create a new Product */
export type ProductCreateInput = {
  features: Array<ProductFeatureRelateProductFeatureCreateRelationInput>;
  name: Scalars['String'];
  price: Scalars['String'];
};

export type ProductCreatePayload = {
  __typename?: 'ProductCreatePayload';
  product?: Maybe<Product>;
};

export type ProductDeletePayload = {
  __typename?: 'ProductDeletePayload';
  deletedId: Scalars['ID'];
};

export type ProductEdge = {
  __typename?: 'ProductEdge';
  cursor: Scalars['String'];
  node: Product;
};

/** Input to create a new ProductFeatureRelateProductFeature */
export type ProductFeatureRelateProductFeatureCreateInput = {
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

/** Input to create a new ProductFeatureRelateProductFeature relation */
export type ProductFeatureRelateProductFeatureCreateRelationInput = {
  create?: InputMaybe<ProductFeatureRelateProductFeatureCreateInput>;
  link?: InputMaybe<Scalars['ID']>;
};

/** Input to update a ProductFeatureRelateProductFeature relation */
export type ProductFeatureRelateProductFeatureUpdateRelationInput = {
  create?: InputMaybe<ProductFeatureRelateProductFeatureCreateInput>;
  link?: InputMaybe<Scalars['ID']>;
  unlink?: InputMaybe<Scalars['ID']>;
};

/** Input to create a new Product */
export type ProductUpdateInput = {
  features?: InputMaybe<Array<ProductFeatureRelateProductFeatureUpdateRelationInput>>;
  name?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<Scalars['String']>;
};

export type ProductUpdatePayload = {
  __typename?: 'ProductUpdatePayload';
  product?: Maybe<Product>;
};

export type Query = {
  __typename?: 'Query';
  /** Query a single Customer by an ID or a unique field */
  customer?: Maybe<Customer>;
  /** Paginated query to fetch the whole list of `Customer`. */
  customerCollection?: Maybe<CustomerConnection>;
  /** Query a single Feature by an ID or a unique field */
  feature?: Maybe<Feature>;
  /** Paginated query to fetch the whole list of `Feature`. */
  featureCollection?: Maybe<FeatureConnection>;
  /** Query a single Identity by an ID or a unique field */
  identity?: Maybe<Identity>;
  /** Paginated query to fetch the whole list of `Identity`. */
  identityCollection?: Maybe<IdentityConnection>;
  /** Query a single Product by an ID or a unique field */
  product?: Maybe<Product>;
  /** Paginated query to fetch the whole list of `Product`. */
  productCollection?: Maybe<ProductConnection>;
  /** Query a single Subscription by an ID or a unique field */
  subscription?: Maybe<Subscription>;
  /** Paginated query to fetch the whole list of `Subscription`. */
  subscriptionCollection?: Maybe<SubscriptionConnection>;
  /** Query a single User by an ID or a unique field */
  user?: Maybe<User>;
  /** Paginated query to fetch the whole list of `User`. */
  userCollection?: Maybe<UserConnection>;
};


export type QueryCustomerArgs = {
  by: CustomerByInput;
};


export type QueryCustomerCollectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryFeatureArgs = {
  by: FeatureByInput;
};


export type QueryFeatureCollectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryIdentityArgs = {
  by: IdentityByInput;
};


export type QueryIdentityCollectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryProductArgs = {
  by: ProductByInput;
};


export type QueryProductCollectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QuerySubscriptionArgs = {
  by: SubscriptionByInput;
};


export type QuerySubscriptionCollectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryUserArgs = {
  by: UserByInput;
};


export type QueryUserCollectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export enum SubStatus {
  Active = 'ACTIVE',
  Canceled = 'CANCELED',
  Incomplete = 'INCOMPLETE',
  IncompleteExpired = 'INCOMPLETE_EXPIRED',
  PastDue = 'PAST_DUE',
  Trialing = 'TRIALING',
  Unpaid = 'UNPAID'
}

export type Subscription = {
  __typename?: 'Subscription';
  /** when the model was created */
  createdAt: Scalars['DateTime'];
  customer: Customer;
  endDate?: Maybe<Scalars['Timestamp']>;
  id: Scalars['ID'];
  product: Product;
  quantity: Scalars['Int'];
  startDate: Scalars['Timestamp'];
  status: SubStatus;
  trialEnd?: Maybe<Scalars['Timestamp']>;
  trialStart?: Maybe<Scalars['Timestamp']>;
  /** when the model was updated */
  updatedAt: Scalars['DateTime'];
};

export type SubscriptionByInput = {
  id?: InputMaybe<Scalars['ID']>;
};

export type SubscriptionConnection = {
  __typename?: 'SubscriptionConnection';
  edges?: Maybe<Array<Maybe<SubscriptionEdge>>>;
  /** Information to aid in pagination */
  pageInfo: PageInfo;
};

/** Input to create a new Subscription */
export type SubscriptionCreateInput = {
  customer: SubscriptionCustomerRelateSubscriptionCustomerCreateRelationInput;
  endDate?: InputMaybe<Scalars['Timestamp']>;
  product: SubscriptionProductRelateSubscriptionProductCreateRelationInput;
  quantity: Scalars['Int'];
  startDate: Scalars['Timestamp'];
  status: SubStatus;
  trialEnd?: InputMaybe<Scalars['Timestamp']>;
  trialStart?: InputMaybe<Scalars['Timestamp']>;
};

export type SubscriptionCreatePayload = {
  __typename?: 'SubscriptionCreatePayload';
  subscription?: Maybe<Subscription>;
};

/** Input to create a new SubscriptionCustomerRelateSubscriptionCustomer */
export type SubscriptionCustomerRelateSubscriptionCustomerCreateInput = {
  stripeId: Scalars['String'];
  user: CustomerCustomerRelateUserUserCreateInput;
};

/** Input to create a new SubscriptionCustomerRelateSubscriptionCustomer relation */
export type SubscriptionCustomerRelateSubscriptionCustomerCreateRelationInput = {
  create?: InputMaybe<SubscriptionCustomerRelateSubscriptionCustomerCreateInput>;
  link?: InputMaybe<Scalars['ID']>;
};

/** Input to update a SubscriptionCustomerRelateSubscriptionCustomer relation */
export type SubscriptionCustomerRelateSubscriptionCustomerUpdateRelationInput = {
  create?: InputMaybe<SubscriptionCustomerRelateSubscriptionCustomerCreateInput>;
  link?: InputMaybe<Scalars['ID']>;
  unlink?: InputMaybe<Scalars['ID']>;
};

export type SubscriptionDeletePayload = {
  __typename?: 'SubscriptionDeletePayload';
  deletedId: Scalars['ID'];
};

export type SubscriptionEdge = {
  __typename?: 'SubscriptionEdge';
  cursor: Scalars['String'];
  node: Subscription;
};

/** Input to create a new SubscriptionProductRelateSubscriptionProduct */
export type SubscriptionProductRelateSubscriptionProductCreateInput = {
  features: Array<ProductFeatureRelateProductFeatureCreateInput>;
  name: Scalars['String'];
  price: Scalars['String'];
};

/** Input to create a new SubscriptionProductRelateSubscriptionProduct relation */
export type SubscriptionProductRelateSubscriptionProductCreateRelationInput = {
  create?: InputMaybe<SubscriptionProductRelateSubscriptionProductCreateInput>;
  link?: InputMaybe<Scalars['ID']>;
};

/** Input to update a SubscriptionProductRelateSubscriptionProduct relation */
export type SubscriptionProductRelateSubscriptionProductUpdateRelationInput = {
  create?: InputMaybe<SubscriptionProductRelateSubscriptionProductCreateInput>;
  link?: InputMaybe<Scalars['ID']>;
  unlink?: InputMaybe<Scalars['ID']>;
};

/** Input to create a new Subscription */
export type SubscriptionUpdateInput = {
  customer?: InputMaybe<SubscriptionCustomerRelateSubscriptionCustomerUpdateRelationInput>;
  endDate?: InputMaybe<Scalars['Timestamp']>;
  product?: InputMaybe<SubscriptionProductRelateSubscriptionProductUpdateRelationInput>;
  quantity?: InputMaybe<Scalars['Int']>;
  startDate?: InputMaybe<Scalars['Timestamp']>;
  status?: InputMaybe<SubStatus>;
  trialEnd?: InputMaybe<Scalars['Timestamp']>;
  trialStart?: InputMaybe<Scalars['Timestamp']>;
};

export type SubscriptionUpdatePayload = {
  __typename?: 'SubscriptionUpdatePayload';
  subscription?: Maybe<Subscription>;
};

export type User = {
  __typename?: 'User';
  /** when the model was created */
  createdAt: Scalars['DateTime'];
  customer?: Maybe<Customer>;
  email: Scalars['Email'];
  id: Scalars['ID'];
  identities?: Maybe<IdentityConnection>;
  name?: Maybe<Scalars['String']>;
  /** when the model was updated */
  updatedAt: Scalars['DateTime'];
};


export type UserIdentitiesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type UserByInput = {
  email?: InputMaybe<Scalars['Email']>;
  id?: InputMaybe<Scalars['ID']>;
};

export type UserConnection = {
  __typename?: 'UserConnection';
  edges?: Maybe<Array<Maybe<UserEdge>>>;
  /** Information to aid in pagination */
  pageInfo: PageInfo;
};

/** Input to create a new User */
export type UserCreateInput = {
  customer?: InputMaybe<UserCustomerRelateUserCustomerCreateRelationInput>;
  email: Scalars['Email'];
  identities?: InputMaybe<Array<UserIdentityRelateUserIdentityCreateRelationInput>>;
  name?: InputMaybe<Scalars['String']>;
};

export type UserCreatePayload = {
  __typename?: 'UserCreatePayload';
  user?: Maybe<User>;
};

/** Input to create a new UserCustomerRelateUserCustomer */
export type UserCustomerRelateUserCustomerCreateInput = {
  stripeId: Scalars['String'];
  subscription?: InputMaybe<CustomerCustomerRelateSubscriptionSubscriptionCreateInput>;
};

/** Input to create a new UserCustomerRelateUserCustomer relation */
export type UserCustomerRelateUserCustomerCreateRelationInput = {
  create?: InputMaybe<UserCustomerRelateUserCustomerCreateInput>;
  link?: InputMaybe<Scalars['ID']>;
};

/** Input to update a UserCustomerRelateUserCustomer relation */
export type UserCustomerRelateUserCustomerUpdateRelationInput = {
  create?: InputMaybe<UserCustomerRelateUserCustomerCreateInput>;
  link?: InputMaybe<Scalars['ID']>;
  unlink?: InputMaybe<Scalars['ID']>;
};

export type UserDeletePayload = {
  __typename?: 'UserDeletePayload';
  deletedId: Scalars['ID'];
};

export type UserEdge = {
  __typename?: 'UserEdge';
  cursor: Scalars['String'];
  node: User;
};

/** Input to create a new UserIdentityRelateUserIdentity */
export type UserIdentityRelateUserIdentityCreateInput = {
  sub: Scalars['String'];
  type: IdentityType;
};

/** Input to create a new UserIdentityRelateUserIdentity relation */
export type UserIdentityRelateUserIdentityCreateRelationInput = {
  create?: InputMaybe<UserIdentityRelateUserIdentityCreateInput>;
  link?: InputMaybe<Scalars['ID']>;
};

/** Input to update a UserIdentityRelateUserIdentity relation */
export type UserIdentityRelateUserIdentityUpdateRelationInput = {
  create?: InputMaybe<UserIdentityRelateUserIdentityCreateInput>;
  link?: InputMaybe<Scalars['ID']>;
  unlink?: InputMaybe<Scalars['ID']>;
};

/** Input to create a new User */
export type UserUpdateInput = {
  customer?: InputMaybe<UserCustomerRelateUserCustomerUpdateRelationInput>;
  email?: InputMaybe<Scalars['Email']>;
  identities?: InputMaybe<Array<UserIdentityRelateUserIdentityUpdateRelationInput>>;
  name?: InputMaybe<Scalars['String']>;
};

export type UserUpdatePayload = {
  __typename?: 'UserUpdatePayload';
  user?: Maybe<User>;
};

export type CustomerPartsFragment = { __typename?: 'Customer', id: string, stripeId: string };

export type FeaturePartsFragment = { __typename?: 'Feature', id: string, name: string, description?: string | null };

export type IdentityPartsFragment = { __typename?: 'Identity', id: string, sub: string, type: IdentityType };

export type ProductPartsFragment = { __typename?: 'Product', id: string, name: string, price: string };

export type SubscriptionPartsFragment = { __typename?: 'Subscription', id: string, startDate: any, endDate?: any | null, quantity: number, status: SubStatus, trialStart?: any | null, trialEnd?: any | null };

export type UserPartsFragment = { __typename?: 'User', id: string, email: string, name?: string | null };

export type UserByEmailQueryVariables = Exact<{
  email: Scalars['Email'];
}>;


export type UserByEmailQuery = { __typename?: 'Query', user?: { __typename?: 'User', createdAt: any, updatedAt: any, id: string, email: string, name?: string | null, customer?: { __typename?: 'Customer', id: string, stripeId: string } | null, identities?: { __typename?: 'IdentityConnection', edges?: Array<{ __typename?: 'IdentityEdge', node: { __typename?: 'Identity', id: string, sub: string, type: IdentityType } } | null> | null } | null } | null };

export type UserByIdQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type UserByIdQuery = { __typename?: 'Query', user?: { __typename?: 'User', createdAt: any, updatedAt: any, id: string, email: string, name?: string | null, customer?: { __typename?: 'Customer', id: string, stripeId: string } | null, identities?: { __typename?: 'IdentityConnection', edges?: Array<{ __typename?: 'IdentityEdge', node: { __typename?: 'Identity', id: string, sub: string, type: IdentityType } } | null> | null } | null } | null };

export const CustomerPartsFragmentDoc = `
    fragment CustomerParts on Customer {
  id
  stripeId
}
    `;
export const FeaturePartsFragmentDoc = `
    fragment FeatureParts on Feature {
  id
  name
  description
}
    `;
export const IdentityPartsFragmentDoc = `
    fragment IdentityParts on Identity {
  id
  sub
  type
}
    `;
export const ProductPartsFragmentDoc = `
    fragment ProductParts on Product {
  id
  name
  price
}
    `;
export const SubscriptionPartsFragmentDoc = `
    fragment SubscriptionParts on Subscription {
  id
  startDate
  endDate
  quantity
  status
  trialStart
  trialEnd
}
    `;
export const UserPartsFragmentDoc = `
    fragment UserParts on User {
  id
  email
  name
}
    `;
export const UserByEmailDocument = `
    query UserByEmail($email: Email!) {
  user(by: {email: $email}) {
    ...UserParts
    createdAt
    updatedAt
    customer {
      ...CustomerParts
    }
    identities(first: 100) {
      edges {
        node {
          ...IdentityParts
        }
      }
    }
  }
}
    ${UserPartsFragmentDoc}
${CustomerPartsFragmentDoc}
${IdentityPartsFragmentDoc}`;
export const useUserByEmailQuery = <
      TData = UserByEmailQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables: UserByEmailQueryVariables,
      options?: UseQueryOptions<UserByEmailQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<UserByEmailQuery, TError, TData>(
      ['UserByEmail', variables],
      fetcher<UserByEmailQuery, UserByEmailQueryVariables>(client, UserByEmailDocument, variables, headers),
      options
    );
export const UserByIdDocument = `
    query UserByID($id: ID!) {
  user(by: {id: $id}) {
    ...UserParts
    createdAt
    updatedAt
    customer {
      ...CustomerParts
    }
    identities(first: 100) {
      edges {
        node {
          ...IdentityParts
        }
      }
    }
  }
}
    ${UserPartsFragmentDoc}
${CustomerPartsFragmentDoc}
${IdentityPartsFragmentDoc}`;
export const useUserByIdQuery = <
      TData = UserByIdQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables: UserByIdQueryVariables,
      options?: UseQueryOptions<UserByIdQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<UserByIdQuery, TError, TData>(
      ['UserByID', variables],
      fetcher<UserByIdQuery, UserByIdQueryVariables>(client, UserByIdDocument, variables, headers),
      options
    );