// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  noExternal: [/^@ecomm\//],
  target: 'node18',
  splitting: false,
  skipNodeModulesBundle: true,
});
