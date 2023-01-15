import {
  WrapInTransactionOptions,
  wrapInTransaction,
} from './wrap.in.transaction';

export function Transactional(
  options?: WrapInTransactionOptions,
): MethodDecorator {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<unknown>,
  ) => {
    const originalMethod = descriptor.value as () => unknown;
    descriptor.value = wrapInTransaction(originalMethod, {
      ...options,
      name: propertyKey,
    });

    Reflect.getMetadataKeys(originalMethod).forEach((originalKey) => {
      const originalMetadata = Reflect.getMetadata(originalKey, originalMethod);
      Reflect.defineMetadata(
        originalKey,
        originalMetadata,
        descriptor.value as object,
      );
    });

    Object.defineProperty(descriptor.value, 'name', {
      value: originalMethod.name,
      writable: false,
    });
  };
}
