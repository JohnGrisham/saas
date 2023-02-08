import { fetchToken } from './fetchToken';
import { RequestInfo, RequestInit, Response } from 'node-fetch';

export async function fetchWithToken(
  url: RequestInfo,
  init?: RequestInit,
): Promise<Response> {
  console.log(url);
  const { token } = await fetchToken();
  return await import('node-fetch').then(({ default: fetch }) =>
    fetch(url, {
      ...init,
      headers: { Authorization: `Bearer ${token}`, ...init?.headers },
    }),
  );
}
