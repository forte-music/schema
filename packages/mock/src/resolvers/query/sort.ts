import { Connection } from '../../models';
import { ConnectionArgs, handleConnection } from './connection';

type SortBy = 'RECENTLY_ADDED' | 'LEXICOGRAPHICALLY' | 'RECENTLY_PLAYED';

interface SortParams {
  sortBy?: SortBy;
  reverse?: boolean;
  filter?: string;
}

interface Sortable {
  name: string;
  lastPlayed?: number;
  timeAdded: number;
}

interface LinkedSortInfo<T> {
  sortable: Sortable;
  original: T;
}

interface Comparator<T> {
  (a: T, b: T): number;
}

export const compare = <T>(a: T, b: T): number => {
  if (a > b) {
    return 1;
  }

  if (a === b) {
    return 0;
  }

  if (b > a) {
    return -1;
  }

  throw new TypeError(`Invariant a: ${a}, b: ${b}`);
};

export const reverseCompare = <T>(a: T, b: T): number => reverse(a, b, compare);

const reverse = <T>(a: T, b: T, inner: Comparator<T>): number => inner(b, a);

const identity = <T>(a: T, b: T, inner: Comparator<T>): number => inner(a, b);

// Returns how closely the record matches the query string.
const searchDistance = (record: string, query: string): number => {
  const normalizedQuery = query.toLowerCase().replace(/ /g, '');
  const normalizedRecord = record.toLowerCase();

  let strength = 0;
  let currentStrength = 0;
  let lastMatchIndex = 0;

  const khars = normalizedQuery.split('');
  for (const khar of khars) {
    const indexOfQueryCharacter = normalizedRecord.indexOf(
      khar,
      lastMatchIndex
    );
    if (indexOfQueryCharacter === -1) {
      // A character from the query isn't in the record. Sort to bottom.
      return -1;
    }

    if (lastMatchIndex === indexOfQueryCharacter - 1) {
      // continuation of last match
      currentStrength++;
    } else {
      // broken streak, reset streak strength
      currentStrength = 0;
    }

    // move last match index
    lastMatchIndex = indexOfQueryCharacter;

    // update strength
    strength += currentStrength;
  }

  return strength;
};

const sortWithReverse = <T>(
  reversed: boolean,
  inner: Comparator<T>
): Comparator<T> => {
  return (a: T, b: T): number => {
    const transform = reversed ? reverse : identity;
    return transform(a, b, inner);
  };
};

export type SortConnectionArgs = ConnectionArgs & {
  sort?: SortParams;
};

export const listItemsResolver = <T>(
  values: T[],
  { sort, ...connectionArgs }: SortConnectionArgs,
  process: (item: T) => Sortable
): Connection<T> => {
  const localHandleConnection = (items: T[]) =>
    handleConnection(items, value => value, connectionArgs);

  if (!sort) {
    // No sort was specified, use default sort.

    return localHandleConnection(values);
  }

  const { sortBy = 'LEXICOGRAPHICALLY', reverse = false, filter = '' } = sort;

  let sorter: Comparator<Sortable> = () => 0;
  let filterFunc = (item: Sortable) => searchDistance(item.name, filter) !== -1;

  switch (sortBy) {
    case 'RECENTLY_ADDED':
      sorter = (a: Sortable, b: Sortable) =>
        reverseCompare(a.timeAdded, b.timeAdded);
      break;

    case 'LEXICOGRAPHICALLY':
      sorter = (a: Sortable, b: Sortable) => compare(a.name, b.name);
      break;

    case 'RECENTLY_PLAYED':
      sorter = (a: Sortable, b: Sortable) =>
        reverseCompare(a.lastPlayed || 0, b.lastPlayed || 0);
      break;

    default:
      throw new TypeError(`Unknown Sort ${sortBy}`);
  }

  const mappedValues: LinkedSortInfo<T>[] = values.map(item => ({
    original: item,
    sortable: process(item),
  }));

  const filteredValues = mappedValues.filter(({ sortable }) =>
    filterFunc(sortable)
  );

  const sortedValues = filteredValues.slice();
  sortedValues.sort(
    sortWithReverse(
      reverse,
      (
        { sortable: a }: LinkedSortInfo<T>,
        { sortable: b }: LinkedSortInfo<T>
      ) => sorter(a, b)
    )
  );

  return localHandleConnection(sortedValues.map(({ original }) => original));
};

export const itemsResolver = <T extends Sortable>(map: Map<string, T>) => (
  _: void,
  args: SortConnectionArgs
): Connection<T> => {
  const values = Array.from(map.values());
  return listItemsResolver(values, args, item => item);
};
