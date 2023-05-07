import { Model, Row } from '../model/model';

export abstract class BaseRepository<T> {
  abstract model: Model<T>;

  async create(values: Record<string, any>): Promise<Row<T>> {
    return (await this.model.create(values, { returnCreated: true })) as Row<T>;
  }

  async findOne(where: Record<string, any>): Promise<Row<T>> {
    return await this.model.findOne(where);
  }

  async delete(where?: Record<string, any>): Promise<void> {
    await this.model.delete(where);
  }
}
