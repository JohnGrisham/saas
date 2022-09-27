import { NextApiRequest, NextApiResponse } from 'next';
import { getToken, stripe } from '../../utils';
import { graphQLClient, gql } from 'client';

const signup = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const token = await getToken(req);
      const name = token.name ?? undefined;
      const email = token.email ?? undefined;
      const sub = token.sub ?? '';

      const stripeCustomer = await stripe.customers.create({
        name,
        email,
        metadata: {
          sub,
        },
      });

      const data = await graphQLClient.request(gql`
            mutation CreatUser {
                    userCreate(
                        input: {
                            name: ${name}
                            email: ${email}
                            identities: {
                            create: { type: CREDENTIALS }
                            }
                            customer: {
                            create: { stripeId: ${stripeCustomer.id} }
                            }
                        }
                        ) {
                        user {
                            id
                        }
                    }
                }
            `);

      res.status(200).json({ data });
    } catch (err: any) {
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

export default signup;
