import { CognitoUser } from '@aws-amplify/auth';

interface User extends CognitoUser {
  [key: string]: any;
}

export const isCognitoUser = (user: unknown): user is User => {
  return Object.hasOwn(user as {}, 'authenticationFlowType');
};
