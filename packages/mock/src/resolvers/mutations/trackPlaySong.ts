import { Album, albums, Artist, artists, Song, songs } from '../../models';
import { mustGet, now } from '../../utils';

interface Trackable {
  playCount: number;
  lastPlayed?: number;
}

const updateTrackable = <T extends Trackable>(trackable: T) => {
  trackable.playCount = trackable.playCount + 1;
  trackable.lastPlayed = now();
};

export const trackPlaySong = (_: void, args: { songId: string }): Song => {
  const song = mustGet(songs, args.songId);
  updateTrackable(song);
  return song;
};

interface AlbumSongStats {
  song: Song;
  album: Album;
}

interface ArtistSongStats {
  song: Song;
  artist: Artist;
}

export const trackPlaySongFromAlbum = (
  _: void,
  args: { songId: string; albumId: string }
): AlbumSongStats => {
  const song = mustGet(songs, args.songId);
  const album = mustGet(albums, args.albumId);
  updateTrackable(song);
  updateTrackable(album);

  return { song, album };
};

export const trackPlaySongFromArtist = (
  _: void,
  args: { songId: string; artistId: string }
): ArtistSongStats => {
  const song = mustGet(songs, args.songId);
  const artist = mustGet(artists, args.artistId);

  updateTrackable(song);
  updateTrackable(artist);

  return { song, artist };
};
