import type { JWT } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { getToken, stripe } from '../../../utils';
import jsonwebtoken from 'jsonwebtoken';

const ROOT = process.env.NEXT_PUBLIC_ROOT_URL as string;

export async function POST(req: NextRequest) {
  try {
    const rawToken = await getToken(req);

    if (!rawToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = jsonwebtoken.verify(
      rawToken,
      process.env.NEXTAUTH_SECRET as string,
    ) as JWT;

    const { email = undefined } = token as JWT;
    if (!email) throw Error('Could not get customer email');
    const [customer] = (await stripe.customers.list({ email, limit: 1 })).data;

    if (!customer) {
      throw new Error('Could not locate customer with that email');
    }

    const { url } = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${ROOT}/profile`,
    });

    return NextResponse.json({ url });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
