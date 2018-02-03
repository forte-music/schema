// @flow
import type { Connection, Playlist, PlaylistItem } from '../models';
import { albums, artists, playlists, songs } from '../models';
import { mustGet } from '../utils';
import { itemsResolver, listItemsResolver } from './sort';
import type { SortConnectionArgs } from './sort';

const itemResolver = <T>(map: Map<string, T>) => (
  _: void,
  { id }: { id: string }
): T => mustGet(map, id);

const queryResolvers = {
  Query: {
    album: itemResolver(albums),
    albums: itemsResolver(albums),

    artist: itemResolver(artists),
    artists: itemsResolver(artists),

    song: itemResolver(songs),
    songs: itemsResolver(songs),

    playlist: itemResolver(playlists),
    playlists: itemsResolver(playlists),
  },

  Playlist: {
    items: (
      { items }: Playlist,
      args: SortConnectionArgs
    ): Connection<PlaylistItem> =>
      listItemsResolver(items, args, (item: PlaylistItem) => item.song),
  },
};

export default queryResolvers;
