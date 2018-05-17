// @flow
import type { SongUserStats, Album, Artist, UserStats } from '.';
import type { SongSource } from '@forte-music/schema/fixtures/songs';

import { songs } from '@forte-music/schema/fixtures/songs';
import { arrayPropertyDescriptor, makeMap, propertyDescriptor } from '../utils';
import { albums, artists } from '.';
import { statsId, withUserStats } from './stats';

export type Song = {|
  id: string,
  streamUrl: string,
  name: string,
  duration: number,
  trackNumber: number,
  diskNumber: number,
  timeAdded: number,

  artists: Artist[],
  album: Album,
  stats: UserStats,
  songStats: SongUserStats,
|};

const connectSong = (source: SongSource, defaultStreamUrl: string): Song =>
  // $ExpectError
  (Object.defineProperties(
    {
      id: source.id,
      streamUrl: source.streamUrl || defaultStreamUrl,
      name: source.name,
      duration: source.duration,

      trackNumber: source.trackNumber || 1,
      diskNumber: source.diskNumber || 1,
      timeAdded: source.timeAdded || 0,

      stats: withUserStats(source),
      songStats: songStats(source),
    },
    {
      artists: arrayPropertyDescriptor(() => artists, source.artistIds || []),
      album: propertyDescriptor(() => albums, source.albumId),
    }
  ): any);

const songStats = ({
  id,
  stats: { liked = false, playCount = 0 } = {},
}: SongSource): SongUserStats => ({
  id: songStatsId(id),
  playCount,
  liked,
});

const songStatsId = (id: string): string => `${statsId(id)}:song`;

const processedSongs: Map<string, Song> = makeMap(
  songs.map(source => connectSong(source, '/music/track.mp3'))
);

export default processedSongs;
