export interface SongSource {
  id: number;
  name: string;
  duration: number;
  trackNumber?: number;
  diskNumber?: number;
  timeAdded?: number;

  artistIds?: number[];
  albumId: number;

  playCount?: number;
  lastPlayed?: number;
  liked?: boolean;
}

declare var songs: SongSource[];
