import { Knex } from 'knex';
import { connection } from '../../database/connection';
import {
  WhereOperator,
  mapKeysToValues,
  rawSortToOrderBy,
  parseValueByOperator,
} from './model.helper';

export type RowId = number;
export type Row<T> = T & { id: RowId };
export type FilterableColumn = {
  column: string;
  operator: WhereOperator;
};

type ModelCreateOptions = {
  returnCreated: boolean;
};
type FindAllQuery = {
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
    const data =
      typeof values === 'string'
        ? mapKeysToValues(this.getColumns(), values)
        : values.map((value: Record<string, any>) =>
            mapKeysToValues(this.getColumns(), value)
          );
    const [id] = await this.getQueryBuilder().insert(data);

    return options?.returnCreated ? this.findOne({ id }) : id;
  }

  async findAll(query?: FindAllQuery): Promise<Row<T>[]> {
    const res: Row<T>[] = await this.getQueryBuilder()
      .select(this.columns)
      .where(this.getWhereBuilder(query))
      .limit(query?.limit ? +query.limit : 10)
      .offset(query?.offset ? +query.offset : 0)
      .orderBy(rawSortToOrderBy(query?.sort));

    return res.map((item) => mapKeysToValues(this.columns, item)) as Row<T>[];
  }

  async findOne(where: Record<string, any>): Promise<Row<T>> {
    const found = await this.getQueryBuilder()
      .select(this.columns)
      .where(this.getWhereBuilder(where))
      .first();

    return mapKeysToValues(this.getColumns(), found) as Row<T>;
  }

  async delete(where?: Record<string, any>): Promise<void> {
    await this.getQueryBuilder().where(this.getWhereBuilder(where)).del();
  }
}
