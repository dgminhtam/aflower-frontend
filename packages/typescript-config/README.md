# @workspace/typescript-config

Shared TypeScript configuration for the monorepo.

## Usage

Extend the base config in your `tsconfig.json`:

```json
{
  "extends": "@workspace/typescript-config/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```
