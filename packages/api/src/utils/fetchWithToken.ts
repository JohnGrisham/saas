import { fetchToken } from './fetchToken';
import { RequestInfo, RequestInit, Response } from 'node-fetch';

export async function fetchWithToken(
  url: RequestInfo,
  init?: RequestInit,
): Promise<Response> {
  const { token } = (init?.headers as Record<string, any>)['x-api-key']
    ? { token: undefined }
    : await fetchToken();
  const authorization: Record<string, any> = token
    ? { Authorization: `Bearer ${token}` }
    : {};
  return await import('node-fetch').then(({ default: fetch }) =>
    fetch(url, {
      ...init,
      headers: { ...authorization, ...init?.headers },
    }),
  );
}
