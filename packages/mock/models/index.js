// @flow
export { default as albums } from './albums';
export { default as artists } from './artists';
export { default as songs } from './songs';

export type { Album } from './albums';
export type { Artist } from './artists';
export type { Song } from './songs';
export type { SongUserStats, UserStats, StatsCollection } from './stats';

export type Edge<T> = {
  cursor: string,
  node: T,
};

export type Connection<T> = {
  edges: Edge<T>[],
  count: number,
  pageInfo: PageInfo,
};

type PageInfo = {
  hasNextPage: boolean,
};
