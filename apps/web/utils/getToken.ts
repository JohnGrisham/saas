import { NextRequest } from 'next/server';
import { getToken as getNextToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET;

export const getToken = async (req: NextRequest) => {
  const token = await getNextToken({ req, secret, raw: true });

  return token;
};
