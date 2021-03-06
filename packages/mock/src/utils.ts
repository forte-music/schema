type Identifiable = {
  id: string;
};

export const mustGet = <K, V>(map: Map<K, V>, key: K): V => {
  const value = map.get(key);

  if (value === undefined) {
    throw new TypeError(`Schema invalid. Value not found in map. Key: ${key}`);
  }

  return value;
};

export const mustGetKeys = <T>(map: Map<string, T>, keys: string[]): T[] =>
  keys.map(key => mustGet(map, key));

export const makeMap = <T extends Identifiable>(list: T[]): Map<string, T> =>
  list.reduce((map, identifiable: T) => {
    addToMap(map, identifiable);
    return map;
  }, new Map());

export const addToMap = <T extends Identifiable>(
  map: Map<string, T>,
  item: T
) => {
  map.set(item.id, item);
};

export const now = () => Math.floor(Date.now() / 1000);

export const uuidForNum = (num: number): string =>
  num
    .toString(16)
    .toLowerCase()
    .padStart(32, '0');
