// filter(Boolean) typescript friendly replacement #1
export function nonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

// filter(Boolean) typescript friendly replacement #2
type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T;
export function truthy<T>(value: T): value is Truthy<T> {
  return Boolean(value);
}
