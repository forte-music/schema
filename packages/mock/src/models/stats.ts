import { UserStats as UserStatsSource } from '@forte-music/schema/fixtures/stats';
import { Song } from './songs';

export interface UserStats {
  id: string;
  lastPlayed?: number;
}

export interface SongUserStats {
  id: string;
  playCount: number;
  liked: boolean;
}

export interface StatsCollection {
  song: Song;

  albumStats?: UserStats;
  artistStats?: UserStats;
  playlistStats?: UserStats;
}

export const statsId = (parentId: string) => `${parentId}:stats`;

export const withUserStats = ({
  id,
  stats: { lastPlayed } = { lastPlayed: undefined },
}: {
  id: string;
  stats?: UserStatsSource;
}): UserStats => ({
  id: statsId(id),
  lastPlayed: lastPlayed,
});
