import { albums, AlbumSource } from '@forte-music/schema/fixtures/albums';
import {
  arrayPropertyDescriptor,
  makeMap,
  propertyDescriptor,
  uuidForNum,
} from '../utils';
import { songs, artists } from '.';
import { Song, Artist, UserStats } from '.';
import { withUserStats } from './stats';

export interface Album {
  id: string;
  name: string;
  artworkUrl?: string;
  releaseYear: number;
  timeAdded: number;

  artist: Artist;
  songs: Song[];
  stats: UserStats;
  duration: number;
}

const connectAlbum = (album: AlbumSource): Album => {
  const id = uuidForNum(album.id);
  const artistId = uuidForNum(album.artistId);
  const songIds = album.songIds.map(id => uuidForNum(id));

  return Object.defineProperties(
    {
      id,
      name: album.name,
      artworkUrl: album.artworkUrl,
      releaseYear: album.releaseYear,
      timeAdded: album.timeAdded || 0,
      stats: withUserStats({ id, stats: album.stats }),
    },
    {
      duration: {
        get(this: Album) {
          return this.songs
            .map(song => song.duration || 0)
            .reduce((a, b) => a + b, 0);
        },
      },

      artist: propertyDescriptor(() => artists, artistId),
      songs: arrayPropertyDescriptor(() => songs, songIds),
    }
  );
};

const processedAlbums: Map<string, Album> = makeMap(albums.map(connectAlbum));
export default processedAlbums;
