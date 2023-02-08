import 'dotenv/config';
import { defineConfig } from 'tsup';

export default defineConfig({
  esbuildOptions(options, _context) {
    if (options.define && process.env.API_ENDPOINT) {
      options.define = {
        'process.env.API_ENDPOINT': JSON.stringify(process.env.API_ENDPOINT),
      };
    }
  },
});
