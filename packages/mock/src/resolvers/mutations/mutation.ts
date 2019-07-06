import { IResolverObject } from 'graphql-tools/dist/Interfaces';
import { toggleLike } from './toggleLike';
import {
  trackPlaySong,
  trackPlaySongFromAlbum,
  trackPlaySongFromArtist,
} from './trackPlaySong';

const mutation = {
  Mutation: {
    toggleLike,
    trackPlaySong,
    trackPlaySongFromAlbum,
    trackPlaySongFromArtist,
  } as IResolverObject,
};

export default mutation;
