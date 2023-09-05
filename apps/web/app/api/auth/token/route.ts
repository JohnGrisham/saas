import { NextRequest, NextResponse } from 'next/server';
import { getToken } from '../../../../utils';

export async function GET(req: NextRequest) {
  const token = await getToken(req);

  if (token) {
    return NextResponse.json({ token });
  } else {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}
