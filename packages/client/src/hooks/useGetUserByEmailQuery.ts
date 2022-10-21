import { graphQLClient } from '../provider';
import { Scalars, useUserByEmailQuery } from '../types';
import { isEmail } from '../../../core';

export const useGetUserByEmailQuery = (email: Scalars['Email']) => {
  if (!isEmail(email)) {
    throw new Error(`${email} is an invalid email address!`);
  }

  return useUserByEmailQuery(graphQLClient, { email });
};
