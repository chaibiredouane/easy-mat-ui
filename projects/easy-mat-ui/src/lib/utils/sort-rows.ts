/**
 * The rows of a table in the order given by `sortedBy`, as a new array: the array the application passed in is never
 * reordered, so frozen or read-only arrays (a store's state, `Object.freeze`) work.
 * Two numbers compare as numbers (1, 2, 10); anything else compares as text, as it always did.
 */
export function sortRows<T = any>(rows: readonly T[] | null | undefined, sortedBy?: string | null): T[] {
  const copy = [...(rows ?? [])];
  if (!sortedBy) {
    return copy;
  }
  return copy.sort((x: any, y: any) => {
    const a = x?.[sortedBy];
    const b = y?.[sortedBy];
    if (typeof a === 'number' && typeof b === 'number') {
      return a - b;
    }
    return String(a ?? '').localeCompare(String(b ?? ''));
  });
}
