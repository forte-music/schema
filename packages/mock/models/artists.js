// @flow
import { artists } from '@forte-music/schema/fixtures/artists';
import type { ArtistSource } from '@forte-music/schema/fixtures/artists';
import { arrayPropertyDescriptor, makeMap, uuidForNum } from '../utils';
import { albums } from '.';
import type { Album, UserStats } from '.';
import { withUserStats } from './stats';

export type Artist = {|
  id: string,
  name: string,
  timeAdded: number,

  albums: Album[],
  stats: UserStats,
|};

const connectArtist = (artist: ArtistSource): Artist => {
  const id = uuidForNum(artist.id);
  const albumIds = artist.albumIds.map(id => uuidForNum(id));

  // $ExpectError
  return (Object.defineProperties(
    {
      id,
      name: artist.name,
      timeAdded: artist.timeAdded || 0,
      stats: withUserStats({ id, stats: artist.stats }),
    },
    { albums: arrayPropertyDescriptor(() => albums, albumIds) }
  ): any);
};

const processedArtists: Map<string, Artist> = makeMap(
  artists.map(connectArtist)
);

export default processedArtists;
