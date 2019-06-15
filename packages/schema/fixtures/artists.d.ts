export interface ArtistSource {
  id: number;
  name: string;
  timeAdded?: number;
  albumIds: number[];
  lastPlayed?: number;
}

declare var artists: ArtistSource[];
