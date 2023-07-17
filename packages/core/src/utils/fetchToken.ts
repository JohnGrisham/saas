export const fetchToken = async () =>
  // @ts-ignore
  fetch(`${process.env.NEXT_PUBLIC_ROOT_URL}/api/auth/token`).then((res) =>
    res.json(),
  );
