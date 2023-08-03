import { NextApiRequest } from 'next';
import { getToken as getNextToken } from 'next-auth/jwt';

export const getToken = async (req: NextApiRequest, raw = false) => {
  const token = await getNextToken({ req, raw });

  if (token) {
    return token;
  } else {
    throw new Error('Unable to get user token');
  }
};
