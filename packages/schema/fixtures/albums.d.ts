export interface AlbumSource {
  id: number;
  name: string;
  artworkUrl?: string;
  artistId: number;
  songIds: number[];
  releaseYear: number;
  timeAdded?: number;
  playCount?: number;
  lastPlayed?: number;
}

declare var albums: AlbumSource[];
