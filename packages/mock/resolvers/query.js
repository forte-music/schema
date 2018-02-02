// @flow
import type { Connection, Playlist, PlaylistItem } from '../models';
import type { ConnectionArgs } from './types';

import { albums, artists, playlists, songs } from '../models';
import { mustGet } from '../utils';

const itemResolver = <T>(map: Map<string, T>) => (
  _: void,
  { id }: { id: string }
): T => mustGet(map, id);

const connectionResolver = <T>(map: Map<string, T>) => (
  _: void,
  args: ConnectionArgs
): Connection<T> =>
  handleConnection(
    Array.from(map.keys()).sort(),
    (key: string): T => mustGet(map, key),
    args
  );

const handleConnection = <InputType, NodeType>(
  keys: InputType[],
  getNode: (key: InputType) => NodeType,
  { first = 25, after }: ConnectionArgs
): Connection<NodeType> => {
  const lowerBound = after ? parseInt(after, 10) + 1 : 0;
  const upperBound = first === -1 ? keys.length : lowerBound + first;

  const acceptedKeys = keys.slice(lowerBound, upperBound);

  return {
    pageInfo: {
      count: keys.length,
      hasNextPage: upperBound <= keys.length,
    },
    edges: acceptedKeys.map((key, index) => ({
      cursor: (index + lowerBound).toString(),
      node: getNode(key),
    })),
  };
};

const queryResolvers = {
  Query: {
    album: itemResolver(albums),
    albums: connectionResolver(albums),

    artist: itemResolver(artists),
    artists: connectionResolver(artists),

    song: itemResolver(songs),
    songs: connectionResolver(songs),

    playlist: itemResolver(playlists),
    playlists: connectionResolver(playlists),
  },

  Playlist: {
    items: (
      { items }: Playlist,
      args: ConnectionArgs
    ): Connection<PlaylistItem> => handleConnection(items, item => item, args),
  },
};

export default queryResolvers;
