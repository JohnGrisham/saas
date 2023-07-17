import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const token = await getToken({ req, secret, raw: true });

    res.json({ token });
  } catch {
    res.status(500).send('Internal Server Error.');
  }
}
