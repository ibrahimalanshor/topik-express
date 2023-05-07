import knex, { Knex } from 'knex';
import { connection } from '../../database/connection';
import { mapKeysToValues } from './model.helper';

export type RowId = number;
export type Row<T> = T & { id: RowId };

type WhereOperator =
  | '='
  | '!='
  | '>'
  | '>='
  | '<'
  | '<='
  | 'in'
  | 'null'
  | 'not-null'
  | 'exists'
  | 'not-exists'
  | 'between'
  | 'not-between'
  | 'like';
type FilterableColumn = {
  column: string;
  operator: WhereOperator;
};
type ModelCreateOptions = {
  returnCreated: boolean;
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
          const operator =
            typeof filterable === 'string' ? '=' : filterable.operator;
          builder.where(column, operator, values[column]);
        });
      }
    };
  }
}

export abstract class Model<T> extends BaseModel {
  async create(
    values: Record<string, any>,
    options?: ModelCreateOptions
  ): Promise<RowId | Row<T>> {
    const data = mapKeysToValues(this.getColumns(), values);
    const [id] = await this.getQueryBuilder().insert(data);

    return options?.returnCreated ? this.findOne({ id }) : id;
  }

  async findOne(where: Record<string, any>): Promise<Row<T>> {
    const found = await this.getQueryBuilder()
      .where(this.getWhereBuilder(where))
      .first();

    return mapKeysToValues(this.getColumns(), found) as Row<T>;
  }

  async delete(where?: Record<string, any>): Promise<void> {
    await this.getQueryBuilder().where(this.getWhereBuilder(where)).del();
  }
}
