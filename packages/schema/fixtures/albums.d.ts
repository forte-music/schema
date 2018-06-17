import { UserStats } from './stats';

export interface AlbumSource {
  id: number;
  name: string;
  artworkUrl?: string;
  artistId: number;
  songIds: number[];
  releaseYear: number;
  timeAdded?: number;
  stats?: UserStats;
}

declare var albums: AlbumSource[];
