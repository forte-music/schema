// @flow
import { playlists } from '@forte-music/schema/fixtures/playlists';
import type { PlaylistSource } from '@forte-music/schema/fixtures/playlists';
import { makeMap, mustGetKeys, uuidForNum } from '../utils';
import { songs as songMap } from '.';
import type { Song, UserStats } from '.';
import { withUserStats } from './stats';

export type PlaylistItem = {|
  id: string,
  song: Song,
|};

export type Playlist = {|
  id: string,
  name: string,
  description: string,
  timeAdded: number,

  stats: UserStats,
  items: PlaylistItem[],
  duration: number,
|};

export const connectPlaylist = (playlist: PlaylistSource): Playlist => {
  const id = uuidForNum(playlist.id);
  const songIds = playlist.songIds.map(id => uuidForNum(id));

  // $ExpectError
  return (Object.defineProperties(
    {
      id,
      name: playlist.name,
      description: playlist.description || '',
      timeAdded: playlist.timeAdded || 0,
      stats: withUserStats({ id, stats: playlist.stats }),
    },
    {
      items: {
        get() {
          const songs: Song[] = mustGetKeys(songMap, songIds);
          return songs.map((song, index) => ({
            id: `${playlist.id}:${index}`,
            song,
          }));
        },
      },
      duration: {
        get() {
          return (this: Playlist).items
            .map(item => item.song.duration)
            .reduce((a, b) => a + b, 0);
        },
      },
    }
  ): any);
};

const map: Map<string, Playlist> = makeMap(playlists.map(connectPlaylist));

export default map;
