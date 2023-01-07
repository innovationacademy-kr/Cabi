import { createNamespace, getNamespace, Namespace } from 'cls-hooked';
import {
  NAMESPACE_NAME,
  TYPEORM_DATA_SOURCE_NAME_PREFIX,
  TYPEORM_ENTITY_MANAGER_NAME,
  TYPEORM_HOOK_NAME,
  TYPEORM_DATA_SOURCE_NAME,
} from './constant.transaction';
import { DataSource, EntityManager, Repository } from 'typeorm';
import * as EventEmitter from 'events';
import { isDataSource } from './utils.transaction';
import { TypeOrmUpdatedPatchError } from './errors.transaction';

export type DataSourceName = string | 'default';

const dataSources = new Map<DataSourceName, DataSource>();

interface TypeormTransactionalOptions {
  /**
   * Controls how many hooks (`commit`, `rollback`, `complete`) can be used simultaneously.
   * If you exceed the number of hooks of same type, you get a warning. This is a useful to find possible memory leaks.
   * You can set this options to `0` or `Infinity` to indicate an unlimited number of listeners.
   */
  maxHookHandlers: number;
}

interface TypeormTransactionalData {
  options: TypeormTransactionalOptions;
}

const data: TypeormTransactionalData = {
  options: {
    maxHookHandlers: 10,
  },
};

interface AddTransactionalDataSourceInput {
  /**
   * Custom name for data source
   */
  name?: DataSourceName;
  dataSource: DataSource;
  /**
   * Whether to "patch" some `DataSource` methods to support their usage in transactions (default `true`).
   *
   * If you don't need to use `DataSource` methods in transactions and you only work with `Repositories`,
   * you can set this flag to `false`.
   */
  patch?: boolean;
}

export const getTransactionalContext = () => getNamespace(NAMESPACE_NAME);

export const getDataSourceByName = (name: DataSourceName) =>
  dataSources.get(name);

export const deleteDataSourceByName = (name: DataSourceName) =>
  dataSources.delete(name);

export const getTransactionalOptions = () => data.options;

export const getHookInContext = (context: Namespace | undefined) =>
  context?.get(TYPEORM_HOOK_NAME) as EventEmitter | null;

export const setHookInContext = (
  context: Namespace,
  emitter: EventEmitter | null,
) => context.set(TYPEORM_HOOK_NAME, emitter);

export const setEntityManagerByDataSourceName = (
  context: Namespace,
  name: DataSourceName,
  entityManager: EntityManager | null,
) => {
  if (!dataSources.has(name)) return;

  context.set(TYPEORM_DATA_SOURCE_NAME_PREFIX + name, entityManager);
};

export const getEntityManagerByDataSourceName = (
  context: Namespace,
  name: DataSourceName,
) => {
  if (!dataSources.has(name)) return null;

  return (
    (context.get(TYPEORM_DATA_SOURCE_NAME_PREFIX + name) as EntityManager) ||
    null
  );
};

const setTransactionalOptions = (
  options?: Partial<TypeormTransactionalOptions>,
) => {
  data.options = { ...data.options, ...(options || {}) };
};

const getEntityManagerInContext = (dataSourceName: DataSourceName) => {
  const context = getTransactionalContext();
  if (!context || !context.active) return null;

  return getEntityManagerByDataSourceName(context, dataSourceName);
};

export const initializeTransactionalContext = (
  options?: Partial<TypeormTransactionalOptions>,
) => {
  setTransactionalOptions(options);

  const patchManager = (repositoryType: unknown) => {
    Object.defineProperty(repositoryType, 'manager', {
      get() {
        return (
          getEntityManagerInContext(
            this[TYPEORM_ENTITY_MANAGER_NAME].connection[
              TYPEORM_DATA_SOURCE_NAME
            ] as DataSourceName,
          ) || this[TYPEORM_ENTITY_MANAGER_NAME]
        );
      },
      set(manager: EntityManager | undefined) {
        this[TYPEORM_ENTITY_MANAGER_NAME] = manager;
      },
    });
  };

  const getRepository = (originalFn: (args: unknown) => unknown) => {
    return function patchRepository(...args: unknown[]) {
      const repository = originalFn.apply(this, args);

      if (!(TYPEORM_ENTITY_MANAGER_NAME in repository)) {
        /**
         * Store current manager
         */
        repository[TYPEORM_ENTITY_MANAGER_NAME] = repository.manager;

        /**
         * Patch repository object
         */
        patchManager(repository);
      }

      return repository;
    };
  };

  const originalGetRepository = EntityManager.prototype.getRepository;
  const originalExtend = Repository.prototype.extend;

  EntityManager.prototype.getRepository = getRepository(originalGetRepository);
  Repository.prototype.extend = getRepository(originalExtend);

  patchManager(Repository.prototype);
  return createNamespace(NAMESPACE_NAME) || getNamespace(NAMESPACE_NAME);
};

const patchDataSource = (dataSource: DataSource) => {
  let originalManager = dataSource.manager;

  Object.defineProperty(dataSource, 'manager', {
    get() {
      return (
        getEntityManagerInContext(
          this[TYPEORM_DATA_SOURCE_NAME] as DataSourceName,
        ) || originalManager
      );
    },
    set(manager: EntityManager) {
      originalManager = manager;
    },
  });

  const originalQuery = DataSource.prototype.query;
  if (originalQuery.length !== 3) {
    throw new TypeOrmUpdatedPatchError();
  }

  dataSource.query = function (...args: unknown[]) {
    args[2] = args[2] || this.manager?.queryRunner;

    return originalQuery.apply(this, args);
  };

  const originalCreateQueryBuilder = DataSource.prototype.createQueryBuilder;
  if (originalCreateQueryBuilder.length !== 3) {
    throw new TypeOrmUpdatedPatchError();
  }

  dataSource.createQueryBuilder = function (...args: unknown[]) {
    if (args.length === 0) {
      return originalCreateQueryBuilder.apply(this, [
        this.manager?.queryRunner,
      ]);
    }

    args[2] = args[2] || this.manager?.queryRunner;

    return originalCreateQueryBuilder.apply(this, args);
  };

  dataSource.transaction = function (...args: unknown[]) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return originalManager.transaction(...args);
  };
};

export const addTransactionalDataSource = (
  input: DataSource | AddTransactionalDataSourceInput,
) => {
  if (isDataSource(input)) {
    input = { name: 'default', dataSource: input, patch: true };
  }

  const { name = 'default', dataSource, patch = true } = input;
  if (dataSources.has(name)) {
    throw new Error(`DataSource with name "${name}" has already added.`);
  }

  if (patch) {
    patchDataSource(dataSource);
  }

  dataSources.set(name, dataSource);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  dataSource[TYPEORM_DATA_SOURCE_NAME] = name;
  return input.dataSource;
};
