import 'dotenv/config';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  esbuildOptions(options, _context) {
    if (options.define !== undefined) {
      if (process.env.AUTH_BEARER_TOKEN) {
        options.define['process.env.AUTH_BEARER_TOKEN'] = JSON.stringify(
          process.env.AUTH_BEARER_TOKEN,
        );
      }

      if (process.env.NEXT_PUBLIC_ROOT_URL) {
        options.define['process.env.NEXT_PUBLIC_ROOT_URL'] = JSON.stringify(
          process.env.NEXT_PUBLIC_ROOT_URL,
        );
      }

      if (process.env.PROJECT_ID_VERCEL) {
        options.define['process.env.PROJECT_ID_VERCEL'] = JSON.stringify(
          process.env.PROJECT_ID_VERCEL,
        );
      }

      if (process.env.TEAM_ID_VERCEL) {
        options.define['process.env.TEAM_ID_VERCEL'] = JSON.stringify(
          process.env.TEAM_ID_VERCEL,
        );
      }
    }
  },
});
