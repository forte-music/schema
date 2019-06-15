import { artists, ArtistSource } from '@forte-music/schema/fixtures/artists';
import { makeMap, mustGetKeys, uuidForNum } from '../utils';
import { Album, albums } from '.';

export interface Artist {
  id: string;
  name: string;
  timeAdded: number;

  albums: Album[];
  lastPlayed?: number;
}

export class ArtistImpl implements Artist {
  readonly id: string;
  private readonly albumIds: string[];

  readonly name: string;
  readonly timeAdded: number;

  lastPlayed?: number;

  constructor(args: {
    id: string;
    albumIds: string[];
    name: string;
    timeAdded: number;
    lastPlayed?: number;
  }) {
    this.id = args.id;
    this.albumIds = args.albumIds;
    this.name = args.name;
    this.timeAdded = args.timeAdded;
    this.lastPlayed = args.lastPlayed;
  }

  static fromArtistSource(artist: ArtistSource): ArtistImpl {
    return new ArtistImpl({
      ...artist,

      id: uuidForNum(artist.id),
      albumIds: artist.albumIds.map(id => uuidForNum(id)),

      timeAdded: artist.timeAdded || 0,
      lastPlayed: artist.lastPlayed,
    });
  }

  get albums(): Album[] {
    return mustGetKeys(albums, this.albumIds);
  }
}

const processedArtists: Map<string, Artist> = makeMap(
  artists.map(artist => ArtistImpl.fromArtistSource(artist))
);

export default processedArtists;
