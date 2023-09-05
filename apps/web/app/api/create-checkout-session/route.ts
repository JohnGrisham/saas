import { NextRequest, NextResponse } from 'next/server';
import { constructStripe } from 'payments';
import { getToken } from 'next-auth/jwt';

const ROOT = process.env.NEXT_PUBLIC_ROOT_URL as string;

export async function POST(req: NextRequest) {
  const stripe = constructStripe({ name: 'test', version: '1.0.0' });
  const {
    price = { id: '' },
    quantity = 1,
    metadata = {},
  } = { ...(req.body ?? {}) };

  try {
    const token = await getToken({ req });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      customer: token?.sub,
      line_items: [
        {
          price: price.id,
          quantity,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      subscription_data: {
        trial_from_plan: true,
        metadata,
      },
      success_url: `${ROOT}/profile`,
      cancel_url: `${ROOT}/`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
