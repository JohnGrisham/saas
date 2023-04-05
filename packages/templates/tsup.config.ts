import 'dotenv/config';
import { defineConfig } from 'tsup';

export default defineConfig({
  esbuildOptions(options, _context) {
    options.loader = {
      '.html': 'text',
    };

    options.external = ['fs'];
  },
});
