import { fetchToken } from './fetchToken';

export async function fetchWithToken(
  url: any,
  init?: RequestInit,
): Promise<any> {
  const { token } = (init?.headers as Record<string, any>)['x-api-key']
    ? { token: undefined }
    : await fetchToken();
  const authorization: Record<string, any> = token
    ? { Authorization: `Bearer ${token}` }
    : {};
  return await fetch(url, {
    ...init,
    headers: { ...authorization, ...init?.headers },
  });
}
