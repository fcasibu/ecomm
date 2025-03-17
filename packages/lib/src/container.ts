/* eslint-disable @typescript-eslint/no-explicit-any */

export class Container {
  private static registrations = new Map<
    new (...args: any[]) => any,
    () => any
  >();
  private static instances = new Map<new (...args: any[]) => any, any>();

  static register<T extends new (...args: any[]) => any>(
    cls: T,
    // had to do [infer X, ...infer Xs] since (...args: infer WHAT) does not seem to work at all (?)
    deps: () => T extends new (...args: [infer First, ...infer Rest]) => any
      ? [First, ...Rest]
      : never,
  ): void {
    if (Container.instances.has(cls)) {
      throw new Error(`${cls.name} is already registered`);
    }

    Container.registrations.set(cls, () => new cls(...deps()));
  }

  static resolve<T>(cls: new (...args: any[]) => T): T {
    if (Container.instances.has(cls)) {
      return Container.instances.get(cls);
    }

    if (!Container.registrations.has(cls)) {
      throw new Error(`${cls.name} is not registered yet`);
    }

    const instance = Container.registrations.get(cls)?.();
    Container.instances.set(cls, instance);
    return instance;
  }
}
