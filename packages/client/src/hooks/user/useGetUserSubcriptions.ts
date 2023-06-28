import { graphQLClient } from 'api';
import { Scalars, isEmail, useUserSubscriptionsQuery } from '../../types';

export const useGetUserSubscriptions = (email: Scalars['Email']) => {
  if (!isEmail(email)) {
    throw new Error(`${email} is an invalid email address!`);
  }

  return useUserSubscriptionsQuery(graphQLClient(), { email });
};
