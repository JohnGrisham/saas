import type { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';
import { HttpMethod } from 'core';

export async function POST(req: NextApiRequest) {
  const { domain } = req.query;

  try {
    const response = await fetch(
      `https://api.vercel.com/v6/domains/${domain}/request-delegation?teamId=${
        process.env.TEAM_ID_VERCEL ?? ''
      }`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN ?? ''}`,
          'Content-Type': 'application/json',
        },
        method: HttpMethod.POST,
      },
    );

    return NextResponse.json({}, { status: response.ok ? 200 : 403 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
