type OmitFields<T, K extends keyof T> = Omit<T, K>;

export function omitFields<T, K extends keyof T>(
  obj: T,
  keys: K[],
): OmitFields<T, K> {
  const result = { ...obj } as T;
  for (const key of keys) {
    delete result[key];
  }
  return result as OmitFields<T, K>;
}
