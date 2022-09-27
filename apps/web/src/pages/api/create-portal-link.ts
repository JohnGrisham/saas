import { NextApiRequest, NextApiResponse } from 'next';
import { getToken, stripe } from '../../utils';

const ROOT = process.env.NEXT_PUBLIC_ROOT_URL as string;

const createPortalLink = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const token = await getToken(req);
      const sub = token.sub;

      if (!sub) throw Error('Could not get customer sub');
      const customer = await stripe.customers.create({
        email: token.email ?? undefined,
        name: token.name ?? undefined,
        metadata: {
          sub,
        },
      });

      const { url } = await stripe.billingPortal.sessions.create({
        customer: customer.id,
        return_url: `${ROOT}/account`,
      });

      return res.status(200).json({ url });
    } catch (err: any) {
      console.log(err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).send('Method Not Allowed');
    res.end();
  }
};

export default createPortalLink;
