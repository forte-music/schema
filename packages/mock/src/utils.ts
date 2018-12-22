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

// The getMap is needed because due to circular imports, the map may be
// undefined at import time. For example if song imports album's map and
// album import's songs map album's song map will be undefined because song
// hasn't exported anything yet.
export const arrayPropertyDescriptor = <T>(
  getMap: () => Map<string, T>,
  keys: string[]
) => ({
  get: () => mustGetKeys(getMap(), keys),
});

export const propertyDescriptor = <T>(
  getMap: () => Map<string, T>,
  key: string
) => ({
  get: () => mustGet(getMap(), key),
});

export const propertyDescriptorWithSet = <T>(
  getMap: () => Map<string, T>,
  key: string
) => ({
  get: () => mustGet(getMap(), key),
  set: (val: T): void => {
    getMap().set(key, val);
  },
});

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
