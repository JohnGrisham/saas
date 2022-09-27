import { NextApiRequest } from 'next';
import { getToken as getNextToken } from 'next-auth/jwt';

export const getToken = async (req: NextApiRequest) => {
  const token = await getNextToken({ req });

  if (token) {
    return token;
  } else {
    throw new Error('Unable to get user token');
  }
};
