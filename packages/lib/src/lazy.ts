export function lazy<T>(factory: () => T) {
  let instance: T | null = null;

  return () => {
    if (instance === null) {
      instance = factory();
    }

    return instance;
  };
}
