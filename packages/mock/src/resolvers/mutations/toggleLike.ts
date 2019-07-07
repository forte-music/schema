import { mustGet } from '../../utils';
import { Song, songs } from '../../models';

export const toggleLike = (_: void, args: { songId: string }): Song => {
  const song = mustGet(songs, args.songId);
  song.toggleLike();
  return song;
};
