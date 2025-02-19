/* eslint-disable @typescript-eslint/no-explicit-any */

export class Container {
  private static instances = new Map<new (...args: any[]) => any, any>();

  static register<T extends new (...args: any[]) => any>(
    cls: T,
    deps: T extends new (...args: infer Params) => any ? Params : never,
  ): void {
    if (Container.instances.has(cls)) return;

    Container.instances.set(cls, new cls(...deps));
  }

  static resolve<T>(cls: new (...args: any[]) => T): T {
    if (!Container.instances.has(cls)) {
      throw new Error(`${cls.name} is not registered yet`);
    }
    return Container.instances.get(cls);
  }
}
