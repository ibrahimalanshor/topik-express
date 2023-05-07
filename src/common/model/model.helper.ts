export function mapKeysToValues<T extends string>(
  arr: T[],
  values: Record<string, any>
): Record<string, any> {
  return Object.fromEntries(arr.map((key: T) => [key, values[key]]));
}
