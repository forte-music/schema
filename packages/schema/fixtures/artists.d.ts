export interface ArtistSource {
  id: number;
  name: string;
  timeAdded?: number;
  albumIds: number[];
}

declare var artists: ArtistSource[];
