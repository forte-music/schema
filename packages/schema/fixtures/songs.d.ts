import { SongUserStats } from './stats';

export interface SongSource {
  id: number;
  streamUrl: string;
  name: string;
  duration: number;
  trackNumber?: number;
  diskNumber?: number;
  timeAdded?: number;

  artistIds?: number[];
  albumId: number;
  stats?: SongUserStats;
}

declare var songs: SongSource[];