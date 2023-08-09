# Turborepo/Grafbase SaaS starter

This is an unofficial starter for Turborepo.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `database`: [Grafbase](https://grafbase.com/) Managed GQL service
- `docs`: a [Next.js](https://nextjs.org) app with [Tailwind CSS](https://tailwindcss.com/)
- `web`: another [Next.js](https://nextjs.org) app with [Tailwind CSS](https://tailwindcss.com/)
- `ui`: a stub React component library with [Tailwind CSS](https://tailwindcss.com/) shared by both `web` and `docs` applications
- `auth`: shared [Auth.js](https://authjs.dev) configuration
- `client`: graphql client configuration, types, operations and provider
- `core`: shared utilites and other common logic
- `jest-config`: shared testing config
- `payments-client/payments-server`: Stripe functions and utilities
- `tailwind-config`: shared tailwind config
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [Tailwind CSS](https://tailwindcss.com/) for styles
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Grafbase](https://grafbase.com/) for GQL backend

## Grafbase

Import the project in grafbase: https://grafbase.com/docs/getting-started/first-use

### Client

Configure your client by adding a `.env.local` file to your the `packages/client` folder with the following information found in the grafbase dashboard.

```
API_ENDPOINT=https://{your-project}.grafbase.app/graphql
```

### Auth

The Grafbase client authentication is primarily meant to token based but can still be authenticated via the API token. The API token is required for some operations that happen prior to getting the user's JWT access token. You will need to add the API key to the auth package .env file for this reason.

```
API_KEY=
```
