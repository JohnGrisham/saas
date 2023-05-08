import { graphQLClient } from '../../provider';
import { Scalars, useUserSubscriptionsQuery } from '../../types';
import { isEmail } from 'core';

export const useGetUserSubscriptions = (email: Scalars['Email']) => {
  if (!isEmail(email)) {
    throw new Error(`${email} is an invalid email address!`);
  }

  return useUserSubscriptionsQuery(graphQLClient, { email });
};