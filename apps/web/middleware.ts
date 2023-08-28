import { middleware as platformMiddleware } from 'platforms';

const multidomain: boolean = JSON.parse(
  process.env.NEXT_PUBLIC_MULTIDOMAIN ?? 'false',
);
const middleware = multidomain ? platformMiddleware : () => {};

export default middleware;
