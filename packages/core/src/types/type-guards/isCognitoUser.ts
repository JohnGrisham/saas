import { CognitoUser } from '@aws-amplify/auth';

export interface PasswordUser extends CognitoUser {
  [key: string]: any;
}

export const isCognitoUser = (data: unknown): data is PasswordUser => {
  return Object.hasOwn(data as {}, 'authenticationFlowType');
};
