import {
  DeleteOptions,
  FindOneOptions,
  Model,
  Row,
  UpdateOptions,
} from '../model/model';

export type RowsData<T> = {
  data: T[];
  meta: {
    limit: number;
    offset: number;
    count: number;
  };
};

export abstract class BaseRepository<T> {
  abstract model: Model<T>;

  async create(
    values: Record<string, any> | Record<string, any>[]
  ): Promise<Row<T>> {
    return (await this.model.create(values, { returnCreated: true })) as Row<T>;
  }

  async findALl(query?: Record<string, any>): Promise<RowsData<Row<T>>> {
    return {
      data: await this.model.findAll(query),
      meta: {
        count: await this.model.count(query),
        limit: +(query?.limit ?? 10),
        offset: +(query?.offset ?? 10),
      },
    };
  }

  async findOne(
    where: Record<string, any>,
    options?: FindOneOptions
  ): Promise<Row<T>> {
    return await this.model.findOne(where, options);
  }

  async update(
    where: Record<string, any>,
    values: Record<string, any>,
    options?: UpdateOptions
  ): Promise<Row<T>> {
    return (await this.model.update(where, values, {
      throwOnNoAffectedRows: options?.throwOnNoAffectedRows ?? true,
      returnUpdated: true,
    })) as Row<T>;
  }

  async delete(
    where?: Record<string, any>,
    options?: DeleteOptions
  ): Promise<void> {
    await this.model.delete(where, options);
  }
}
