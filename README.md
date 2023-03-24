# Blog s TS monorepo using Turborepo

This Turborepo includes the following sharing packages and apps.

## Apps and Packages

- `apps/site-nextjs`: a [Next.js](https://nextjs.org/) app
- `packages/logger`: isomorphic logger (a small wrapper around console.log)
- `packages/eslint-config-custom`: Jest and ESLint configurations
- `packages/eslint-config-custom-server`: Jest and ESLint configurations
- `packages/jest-config`: Jest and ESLint configurations
- `packages/tsconfig`: tsconfig.json;s used throughout the monorepo
- `packages/ui`: a dummy React UI library (which contains a single `<CounterButton>` component)

Each package and app is 100% [TypeScript](https://www.typescriptlang.org/).

## Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Jest](https://jestjs.io) test runner for all things JavaScript
- [Prettier](https://prettier.io) for code formatting

## Run

Run the following command:

```sh
pnpm install
yarn install
yarn dev
```
