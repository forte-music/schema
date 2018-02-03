// @flow
import type { UserStats as UserStatsSource } from '@forte-music/schema/fixtures/stats';
import type { Song } from './songs';

export type UserStats = {|
  id: string,
  playCount: number,
  lastPlayed?: number,
|};

export type SongUserStats = {|
  id: string,
  liked: boolean,
|};

export type StatsCollection = {|
  song: Song,

  albumStats?: UserStats,
  artistStats?: UserStats,
  playlistStats?: UserStats,
|};

export const statsId = (parentId: string) => `${parentId}:stats`;

export const withUserStats = ({
  id,
  stats: { playCount = 0, lastPlayed } = {},
}: {
  id: string,
  +stats?: UserStatsSource,
}): UserStats => ({
  id: statsId(id),
  playCount: playCount,
  lastPlayed: lastPlayed,
});
