import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from '../../../utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const token = await getToken(req, true);

  res.json({ token });
}
