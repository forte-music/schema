import { Album, albums, Artist, artists, Song, songs } from '../../models';
import { mustGet, now } from '../../utils';

export const trackPlaySong = (_: void, args: { songId: string }): Song => {
  const song = mustGet(songs, args.songId);
  song.lastPlayed = now();
  song.playCount += 1;

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

  if (!album.songs.includes(song)) {
    throw Error('song not found in album');
  }

  song.lastPlayed = now();
  song.playCount += 1;
  album.lastPlayed = now();

  return { song, album };
};

export const trackPlaySongFromArtist = (
  _: void,
  args: { songId: string; artistId: string }
): ArtistSongStats => {
  const song = mustGet(songs, args.songId);
  const artist = mustGet(artists, args.artistId);

  if (!artist.songs.includes(song)) {
    throw Error('song not found in artist');
  }

  song.lastPlayed = now();
  song.playCount += 1;
  artist.lastPlayed = now();

  return { song, artist };
};
