## Adding components

To add components, run the following command at the root of your `web` app:

```bash
npx shadcn@latest add button -c packages/library
```

This will place the ui components in the `packages/library/src/components` directory.

## Using components

To use the components in your app, import them from the `lib` package.

```tsx
import { Button } from "@owl/lib/components/button";
```
