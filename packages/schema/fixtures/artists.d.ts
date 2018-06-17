import { UserStats } from './stats';

export interface ArtistSource {
  id: number;
  name: string;
  timeAdded?: number;
  albumIds: number[];
  stats?: UserStats;
}

declare var artists: ArtistSource[];
