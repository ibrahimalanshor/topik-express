import { Knex } from 'knex';
import { connection } from '../../database/connection';
import { EmptyResultError } from '../errors/empty-result-error';
import {
  WhereOperator,
  mapKeysToValues,
  rawSortToOrderBy,
  parseValueByOperator,
} from './model.helper';

export type RowId = number;
export type Row<T> = T & { id: RowId };
export type AffectedRow = number;
export type FilterableColumn = {
  column: string;
  operator: WhereOperator;
};

export type ModelCreateOptions = {
  returnCreated: boolean;
};
export type FindOneOptions = {
  throwOnEmpty: boolean;
};
export type UpdateOptions = {
  throwOnNoAffectedRows: boolean;
  returnUpdated: boolean;
};
export type DeleteOptions = {
  throwOnNoAffectedRows: boolean;
};
export type FindAllQuery = {
  [key: string]: any;
  limit?: number;
  offset?: number;
  sort?: string;
};

abstract class BaseModel {
  public abstract tableName: string;
  public abstract columns: string[];
  public abstract filterables: (FilterableColumn | string)[];

  getColumns(): string[] {
    return ['id', ...this.columns, 'created_at', 'updated_at'];
  }

  getQueryBuilder(): Knex.QueryBuilder {
    return connection(this.tableName);
  }

  getWhereBuilder(
    values?: Record<string, any>
  ): (builder: Knex.QueryBuilder) => void {
    return (builder: Knex.QueryBuilder) => {
      if (values) {
        this.filterables.forEach((filterable: FilterableColumn | string) => {
          const column =
            typeof filterable === 'string' ? filterable : filterable.column;

          if (values[column]) {
            const operator =
              typeof filterable === 'string' ? '=' : filterable.operator;

            builder.where(
              column,
              operator,
              parseValueByOperator(operator, values[column])
            );
          }
        });
      }
    };
  }
}

export abstract class Model<T> extends BaseModel {
  async create(
    values: Record<string, any> | Record<string, any>[],
    options?: ModelCreateOptions
  ): Promise<RowId | Row<T>> {
    const data = !Array.isArray(values)
      ? mapKeysToValues(this.getColumns(), values)
      : values.map((value: Record<string, any>) =>
          mapKeysToValues(this.getColumns(), value)
        );
    const [id] = await this.getQueryBuilder().insert(data);

    return options?.returnCreated ? await this.findOne({ id }) : id;
  }

  async findAll(query?: FindAllQuery): Promise<Row<T>[]> {
    const res: Row<T>[] = await this.getQueryBuilder()
      .select(this.getColumns())
      .where(this.getWhereBuilder(query))
      .limit(query?.limit ? +query.limit : 10)
      .offset(query?.offset ? +query.offset : 0)
      .orderBy(rawSortToOrderBy(query?.sort));

    return res.map((item) =>
      mapKeysToValues(this.getColumns(), item)
    ) as Row<T>[];
  }

  async count(query?: Record<string, any>): Promise<number> {
    const res = await this.getQueryBuilder()
      .where(this.getWhereBuilder(query))
      .count('id as count');

    return res[0].count;
  }

  async findOne(
    where: Record<string, any>,
    options?: FindOneOptions
  ): Promise<Row<T>> {
    const found = await this.getQueryBuilder()
      .select(this.getColumns())
      .where(this.getWhereBuilder(where))
      .first();

    if (!found && options?.throwOnEmpty) {
      throw new EmptyResultError();
    }

    return mapKeysToValues(this.getColumns(), found) as Row<T>;
  }

  async update(
    where: Record<string, any>,
    values: Record<string, any>,
    options?: UpdateOptions
  ): Promise<AffectedRow | Row<T>> {
    const affected = await this.getQueryBuilder()
      .where(this.getWhereBuilder(where))
      .update(values);

    if (affected < 1 && options?.throwOnNoAffectedRows) {
      throw new EmptyResultError();
    }

    return options?.returnUpdated ? await this.findOne(where) : affected;
  }

  async delete(
    where?: Record<string, any>,
    options?: DeleteOptions
  ): Promise<void> {
    const affected = await this.getQueryBuilder()
      .where(this.getWhereBuilder(where))
      .del();

    if (affected < 1 && options?.throwOnNoAffectedRows) {
      throw new EmptyResultError();
    }
  }
}
