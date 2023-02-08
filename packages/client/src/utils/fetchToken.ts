export const fetchToken = async () =>
  await import('node-fetch').then(({ default: fetch }) =>
    fetch(new URL('/api/auth/token', process.env.NEXT_PUBLIC_ROOT_URL)).then(
      (res) => res.json(),
    ),
  );
