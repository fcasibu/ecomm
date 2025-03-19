import type { DynamicOptions } from 'next/dynamic';
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

// ref: https://github.com/facebook/react/issues/14603
export function dynamicImport<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends ComponentType<any>,
  U extends Record<string, T>,
>(
  factory: () => Promise<U>,
  modules: Partial<Record<keyof U, DynamicOptions<U> | null>>,
  globalOptions: DynamicOptions<T> = {},
) {
  const entries = Object.entries(modules) as [
    keyof U,
    DynamicOptions<U> | null,
  ][];

  return Object.fromEntries(
    entries.map(([name, options]) => [
      name,
      dynamic(() => factory().then((mod) => mod[name]), {
        ...globalOptions,
        ...options,
      }),
    ]),
  ) as Record<NoInfer<keyof U>, T>;
}
