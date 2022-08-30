import 'dotenv/config';
import { defineConfig } from 'tsup';

export default defineConfig({
  esbuildOptions(options, _context) {
    if (options.define && process.env.PRIMARY_USER_LIST_ID) {
      options.define = {
        'process.env.PRIMARY_USER_LIST_ID': JSON.stringify(
          process.env.PRIMARY_USER_LIST_ID,
        ),
      };
    }
  },
});
