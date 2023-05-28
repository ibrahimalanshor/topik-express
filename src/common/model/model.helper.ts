type OrderBy = {
  column: string;
  order: 'asc' | 'desc';
};
export type WhereOperator =
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

export function mapKeysToValues<T extends string>(
  arr: T[],
  values: Record<string, any>
): Record<string, any> {
  return Object.fromEntries(arr.map((key: T) => [key, values[key]]));
}

export function rawSortToOrderBy(sort?: string): OrderBy[] {
  if (!sort) {
    return [{ column: 'id', order: 'asc' }];
  }

  return sort.split(',').map((column) => {
    if (column.charAt(0) === '-') {
      return {
        column: column.slice(1),
        order: 'desc',
      };
    }

    return {
      column,
      order: 'asc',
    };
  });
}

export function parseValueByOperator(operator: WhereOperator, value: any): any {
  if (operator !== 'like') {
    return value;
  }

  return `%${value}%`;
}
