import { sortRows } from './sort-rows';

describe('sortRows', () => {
  it('returns a new array and leaves the one it received untouched', () => {
    const rows = [{ id: 3 }, { id: 1 }, { id: 2 }];
    const sorted = sortRows(rows, 'id');
    expect(sorted).not.toBe(rows);
    expect(rows.map(r => r.id)).toEqual([3, 1, 2]);
    expect(sorted.map(r => r.id)).toEqual([1, 2, 3]);
  });

  it('works on a frozen array', () => {
    const rows = Object.freeze([{ id: 2 }, { id: 1 }]);
    expect(() => sortRows(rows, 'id')).not.toThrow();
    expect(sortRows(rows, 'id').map(r => r.id)).toEqual([1, 2]);
  });

  it('orders numbers as numbers', () => {
    const rows = Array.from({ length: 12 }, (_, i) => ({ id: 12 - i }));
    expect(sortRows(rows, 'id').map(r => r.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it('keeps comparing text as text, including numeric strings', () => {
    expect(sortRows([{ id: '2' }, { id: '10' }, { id: '1' }], 'id').map(r => r.id)).toEqual(['1', '10', '2']);
    expect(sortRows([{ n: 'b' }, { n: 'a' }], 'n').map(r => r.n)).toEqual(['a', 'b']);
  });

  it('puts missing values first and does not throw', () => {
    expect(sortRows([{ n: 'b' }, {}, { n: 'a' }], 'n').map(r => (r as any).n)).toEqual([undefined, 'a', 'b']);
  });

  it('keeps the given order when there is no sortedBy', () => {
    const rows = [{ id: 3 }, { id: 1 }];
    expect(sortRows(rows, '').map(r => r.id)).toEqual([3, 1]);
    expect(sortRows(rows, undefined).map(r => r.id)).toEqual([3, 1]);
  });

  it('accepts no rows', () => {
    expect(sortRows(undefined, 'id')).toEqual([]);
    expect(sortRows(null, 'id')).toEqual([]);
  });
});
