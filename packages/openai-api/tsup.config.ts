import 'dotenv/config';
import { defineConfig } from 'tsup';

export default defineConfig({
  esbuildOptions(options, _context) {
    if (options.define !== undefined) {
      if (process.env.OPENAI_API_KEY) {
        options.define['process.env.OPENAI_API_KEY'] = JSON.stringify(
          process.env.OPENAI_API_KEY,
        );
      }
    }
  },
});
