export const fetchToken = async () =>
  await import('node-fetch').then(({ default: fetch }) =>
    fetch(`${process.env.NEXT_PUBLIC_ROOT_URL}/api/auth/token`).then((res) =>
      res.json(),
    ),
  );
