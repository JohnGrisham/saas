import 'dotenv/config';
import { defineConfig } from 'tsup';

export default defineConfig({
  format: ['esm', 'cjs'],
  dts: true,
  esbuildOptions(options, _context) {
    if (options.define !== undefined) {
      if (process.env.STRIPE_SECRET_KEY) {
        options.define['process.env.STRIPE_SECRET_KEY'] = JSON.stringify(
          process.env.STRIPE_SECRET_KEY,
        );
      }

      if (process.env.STRIPE_SECRET_KEY_LIVE) {
        options.define['STRIPE_SECRET_KEY_LIVE'] = JSON.stringify(
          process.env.STRIPE_SECRET_KEY_LIVE,
        );
      }

      if (process.env.STRIPE_WEBHOOK_SECRET) {
        options.define['process.env.STRIPE_WEBHOOK_SECRET'] = JSON.stringify(
          process.env.STRIPE_WEBHOOK_SECRET,
        );
      }

      if (process.env.STRIPE_WEBHOOK_SECRET_LIVE) {
        options.define['process.env.STRIPE_WEBHOOK_SECRET_LIVE'] =
          JSON.stringify(process.env.STRIPE_WEBHOOK_SECRET_LIVE);
      }
    }
  },
});
