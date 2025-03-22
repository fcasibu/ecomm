type ExtractKeys<T> =
  T extends Record<string, unknown>
    ? {
        [K in keyof T]-?: K extends string
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            T[K] extends Array<any> | undefined | null
            ?
                | `${K}`
                | `${K}[number]`
                | `${K}[number].${ExtractArrayObjKeys<T[K]>}`
            : `${K}` | `${K}.${ExtractKeys<T[K]>}`
          : K;
      }[keyof T]
    : never;

type ExtractArrayObjKeys<T> =
  T extends Array<infer ArrayValue>
    ? ArrayValue extends Record<string, unknown>
      ? ExtractKeys<ArrayValue>
      : never
    : never;

type PathSegments<P> = P extends `${infer Base}.${infer Rest}`
  ? [Base, ...PathSegments<Rest>]
  : [P];

type Get<T, Path extends Array<string>> =
  T extends Record<string, unknown>
    ? Path extends [infer First, ...infer Rest extends string[]]
      ? First extends string
        ? Rest['length'] extends 0
          ? First extends `${infer ArrKey}[number]`
            ? T[ArrKey] extends undefined | null | Array<infer V>
              ? V
              : never
            : First extends keyof T
              ? T[First]
              : never
          : First extends `${infer ArrKey}[number]`
            ? T[ArrKey] extends undefined | null | Array<infer V>
              ? Get<V, Rest>
              : never
            : First extends keyof T
              ? Get<T[First], Rest>
              : never
        : never
      : never
    : never;

export type ExtractType<
  T extends Record<string, unknown>,
  Path extends ExtractKeys<T>,
> = Get<T, PathSegments<Path>>;

export type StorageType = 'localStorage' | 'sessionStorage';
