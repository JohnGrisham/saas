import type { CodegenConfig } from '@graphql-codegen/cli';
import { isEmail } from '../core';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:4000/graphql',
  documents: 'src/graphql/**/**.gql',
  generates: {
    'src/types/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-query',
      ],
      config: {
        legacyMode: true,
        fetcher: 'graphql-request',
        scalars: {
          Email: 'string',
        },
      },
    },
  },
};

export default config;
