// @flow
import { albums } from '@forte-music/schema/fixtures/albums';
import type { AlbumSource } from '@forte-music/schema/fixtures/albums';
import {
  arrayPropertyDescriptor,
  makeMap,
  propertyDescriptor,
  uuidForNum,
} from '../utils';
import { songs, artists } from '.';
import type { Song, Artist, UserStats } from '.';
import { withUserStats } from './stats';

export type Album = {|
  id: string,
  name: string,
  artworkUrl: string,
  releaseYear: number,
  timeAdded: number,

  artist: Artist,
  songs: Song[],
  stats: UserStats,
  duration: number,
|};

const connectAlbum = (album: AlbumSource): Album => {
  const id = uuidForNum(album.id);
  const artistId = uuidForNum(album.artistId);
  const songIds = album.songIds.map(id => uuidForNum(id));

  // Flow doesn't completely understand defineProperties.
  // https://github.com/facebook/flow/issues/285
  // $ExpectError
  return (Object.defineProperties(
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
        get() {
          return (this: Album).songs
            .map(({ duration = 0 } = {}) => duration)
            .reduce((a, b) => a + b, 0);
        },
      },

      artist: propertyDescriptor(() => artists, artistId),
      songs: arrayPropertyDescriptor(() => songs, songIds),
    }
  ): any);
};

const processedAlbums: Map<string, Album> = makeMap(albums.map(connectAlbum));
export default processedAlbums;
