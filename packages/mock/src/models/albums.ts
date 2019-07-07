import { albums, AlbumSource } from '@forte-music/schema/fixtures/albums';
import { makeMap, mustGet, mustGetKeys, uuidForNum } from '../utils';
import { songs, artists } from '.';
import { Song, Artist } from '.';

export interface Album {
  id: string;
  name: string;
  artworkUrl?: string;
  releaseYear: number;
  timeAdded: number;

  artist: Artist;
  songs: Song[];
  duration: number;

  lastPlayed?: number;
}

export class AlbumImpl implements Album {
  readonly id: string;
  private readonly artistId: string;
  private readonly songIds: string[];

  readonly name: string;
  readonly artworkUrl?: string;
  readonly releaseYear: number;
  readonly timeAdded: number;

  lastPlayed?: number;

  constructor(args: {
    id: string;
    artistId: string;
    songIds: string[];
    name: string;
    artworkUrl?: string;
    releaseYear: number;
    timeAdded: number;
    lastPlayed?: number;
  }) {
    this.id = args.id;
    this.name = args.name;
    this.artistId = args.artistId;
    this.songIds = args.songIds;
    this.artworkUrl = args.artworkUrl;
    this.releaseYear = args.releaseYear;
    this.timeAdded = args.timeAdded;
    this.lastPlayed = args.lastPlayed;
  }

  static fromAlbumSource(album: AlbumSource): AlbumImpl {
    return new AlbumImpl({
      ...album,

      id: uuidForNum(album.id),
      artistId: uuidForNum(album.artistId),
      songIds: album.songIds.map(id => uuidForNum(id)),
      timeAdded: album.timeAdded || 0,

      lastPlayed: album.lastPlayed,
    });
  }

  get artist(): Artist {
    return mustGet(artists, this.artistId);
  }

  get songs(): Song[] {
    return mustGetKeys(songs, this.songIds);
  }

  get duration(): number {
    return this.songs
      .map(song => song.duration || 0)
      .reduce((a, b) => a + b, 0);
  }
}

const processedAlbums: Map<string, AlbumImpl> = makeMap(
  albums.map(album => AlbumImpl.fromAlbumSource(album))
);
export default processedAlbums;
