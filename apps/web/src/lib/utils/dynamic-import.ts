import type { DynamicOptions } from 'next/dynamic';
import dynamic from 'next/dynamic';

// ref: https://github.com/facebook/react/issues/14603
export function dynamicImport<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends React.ComponentType<any>,
  I extends Record<string, T>,
>(
  factory: () => Promise<I>,
  modules: Partial<Record<keyof I, DynamicOptions<I> | null>>,
  globalOptions: DynamicOptions<T> = {},
) {
  const entries = Object.entries(modules) as [
    keyof I,
    DynamicOptions<I> | null,
  ][];

  return Object.fromEntries(
    entries.map(([name, options]) => [
      name,
      dynamic(() => factory().then((mod) => mod[name]), {
        ...options,
        ...globalOptions,
      }),
    ]),
  ) as { [K in keyof typeof modules]-?: I[K] };
}
