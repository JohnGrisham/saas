import 'dotenv/config';
import { defineConfig } from 'tsup';

export default defineConfig({
  esbuildOptions(options, _context) {
    if (options.define !== undefined) {
      if (options.define && process.env.API_ENDPOINT) {
        options.define = {
          'process.env.API_ENDPOINT': JSON.stringify(process.env.API_ENDPOINT),
        };
      }

      if (process.env.OPENAI_API_KEY) {
        options.define['process.env.OPENAI_API_KEY'] = JSON.stringify(
          process.env.OPENAI_API_KEY,
        );
      }
    }
  },
});
