import { middleware } from 'platforms';

export default JSON.parse(process.env.NEXT_PUBLIC_MULTIDOMAIN ?? 'false')
  ? middleware
  : () => {};
