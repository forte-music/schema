export { default as albums } from './albums';
export { default as artists } from './artists';
export { default as songs } from './songs';

export { Album } from './albums';
export { Artist } from './artists';
export { Song } from './songs';
export { SongUserStats, UserStats, StatsCollection } from './stats';

export interface Edge<T> {
  cursor: string;
  node: T;
}

export interface Connection<T> {
  edges: Edge<T>[];
  count: number;
  pageInfo: PageInfo;
}

interface PageInfo {
  hasNextPage: boolean;
}
