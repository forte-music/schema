// @flow
import type { SongUserStats, Album, Artist, UserStats } from '.';
import type { SongSource } from '@forte-music/schema/fixtures/songs';

import { songs } from '@forte-music/schema/fixtures/songs';
import {
  arrayPropertyDescriptor,
  makeMap,
  propertyDescriptor,
  uuidForNum,
} from '../utils';
import { albums, artists } from '.';
import { statsId, withUserStats } from './stats';

export type Song = {|
  id: string,
  streamUrl: string,
  name: string,
  duration: number,
  trackNumber: number,
  timeAdded: number,

  artists: Artist[],
  album: Album,
  stats: UserStats,
  songStats: SongUserStats,
|};

const connectSong = (source: SongSource, defaultStreamUrl: string): Song => {
  const id = uuidForNum(source.id);
  const stats = { id, stats: source.stats };
  const artistIds = (source.artistIds || []).map(id => uuidForNum(id));
  const albumId = uuidForNum(source.albumId);

  // $ExpectError
  return (Object.defineProperties(
    {
      id,
      streamUrl: source.streamUrl || defaultStreamUrl,
      name: source.name,
      duration: source.duration,

      trackNumber: source.trackNumber || 1,
      timeAdded: source.timeAdded || 0,

      stats: withUserStats(stats),
      songStats: songStats(stats),
    },
    {
      artists: arrayPropertyDescriptor(() => artists, artistIds),
      album: propertyDescriptor(() => albums, albumId),
    }
  ): any);
};

const songStats = ({
  id,
  stats: { liked = false, playCount = 0 } = {},
}: {
  id: string,
  stats?: { liked?: boolean, playCount?: number, lastPlayed?: number },
}): SongUserStats => ({
  id: songStatsId(id),
  playCount,
  liked,
});

const songStatsId = (id: string): string => `${statsId(id)}:song`;

const processedSongs: Map<string, Song> = makeMap(
  songs.map(source => connectSong(source, '/music/track.mp3'))
);

export default processedSongs;
