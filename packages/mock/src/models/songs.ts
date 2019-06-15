import { Album, albums, Artist, artists } from '.';
import { songs, SongSource } from '@forte-music/schema/fixtures/songs';
import { makeMap, mustGet, mustGetKeys, now, uuidForNum } from '../utils';

export interface Song {
  id: string;
  name: string;
  duration: number;
  trackNumber: number;
  diskNumber: number;
  timeAdded: number;

  artists: Artist[];
  album: Album;
  lastPlayed?: number;
  playCount: number;
  liked: boolean;
}

export class SongImpl implements Song {
  readonly id: string;
  private readonly artistIds: string[];
  private readonly albumId: string;

  readonly name: string;
  readonly duration: number;
  readonly trackNumber: number;
  readonly diskNumber: number;
  readonly timeAdded: number;

  lastPlayed?: number;
  playCount: number;
  liked: boolean;

  constructor(args: {
    id: string;
    artistIds: string[];
    albumId: string;

    name: string;
    duration: number;
    trackNumber: number;
    diskNumber: number;
    timeAdded: number;

    lastPlayed?: number;
    playCount: number;
    liked: boolean;
  }) {
    this.id = args.id;
    this.artistIds = args.artistIds;
    this.albumId = args.albumId;

    this.name = args.name;
    this.duration = args.duration;
    this.trackNumber = args.trackNumber;
    this.diskNumber = args.diskNumber;
    this.timeAdded = args.timeAdded;

    this.lastPlayed = args.lastPlayed;
    this.playCount = args.playCount;
    this.liked = args.liked;
  }

  static fromSongSource(song: SongSource): SongImpl {
    return new SongImpl({
      ...song,

      id: uuidForNum(song.id),
      artistIds: (song.artistIds || []).map(id => uuidForNum(id)),
      albumId: uuidForNum(song.albumId),

      trackNumber: song.trackNumber || 1,
      diskNumber: song.diskNumber || 1,
      timeAdded: song.timeAdded || 0,

      lastPlayed: song.lastPlayed,
      playCount: song.playCount || 0,
      liked: song.liked || false,
    });
  }

  get artists(): Artist[] {
    return mustGetKeys(artists, this.artistIds);
  }

  get album(): AlbumImpl {
    return mustGet(albums, this.albumId);
  }

  toggleLike() {
    this.liked = !this.liked;
  }

  trackPlayed() {}
}

const processedSongs: Map<string, SongImpl> = makeMap(
  songs.map(source => SongImpl.fromSongSource(source))
);

export default processedSongs;
