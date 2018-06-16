import { albums, artists, songs } from '../models/index';
import { mustGet } from '../utils';
import { itemsResolver } from './sort';

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
  },
};

export default queryResolvers;
