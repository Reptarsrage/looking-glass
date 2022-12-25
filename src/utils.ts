// filter(Boolean) typescript friendly replacement #1
export function nonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

// filter(Boolean) typescript friendly replacement #2
type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T;
export function truthy<T>(value: T): value is Truthy<T> {
  return Boolean(value);
}

// Helper to assign forward'd refs and local refs to the same element
export function assignRefs<T extends HTMLElement>(...refs: React.Ref<T | null>[]) {
  return (node: T | null) => {
    refs.forEach((r) => {
      if (typeof r === 'function') {
        r(node);
      } else if (r) {
        (r as React.MutableRefObject<T | null>).current = node;
      }
    });
  };
}
