import { fetchToken } from './fetchToken';

export async function fetchWithToken(
  url: string,
  headers?: Record<string, any>,
): Promise<any> {
  const { token } = (headers as Record<string, any>)['x-api-key']
    ? { token: undefined }
    : await fetchToken();
  const authorization: Record<string, any> = token
    ? { Authorization: `Bearer ${token}` }
    : {};
  // @ts-ignore
  return fetch(url, {
    headers: { ...authorization, ...headers },
  });
}
