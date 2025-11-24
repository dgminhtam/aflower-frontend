# @workspace/ui

Shared UI component library for Aflower applications. Built with Radix UI and Tailwind CSS.

## Installation

This package is used internally within the monorepo.

```json
// package.json of consuming app
{
  "dependencies": {
    "@workspace/ui": "workspace:*"
  }
}
```

## Usage

Import components directly:

```tsx
import { Button } from "@workspace/ui/components/button";

export default function MyComponent() {
  return <Button>Click me</Button>;
}
```

## Adding New Components

1.  Create a new component file in `src/components`.
2.  Export it in `package.json` exports if necessary (usually auto-mapped via `src/components/*`).
3.  Ensure it uses `cn()` for class merging.
