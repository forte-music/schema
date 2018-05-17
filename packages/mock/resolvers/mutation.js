// @flow
import type {
  Album,
  Artist,
  Playlist,
  Song,
  SongUserStats,
  StatsCollection,
  UserStats,
} from '../models';
import type { PlaylistSource } from '@forte-music/schema/fixtures/playlists';

import { albums, artists, playlists, songs } from '../models';
import { addToMap, mustGet, now, randomInt } from '../utils';
import { connectPlaylist } from '../models/playlists';

const withSong = <T>(inner: Song => T) => (
  _: void,
  { songId }: { songId: string }
): T => inner(mustGet(songs, songId));

const transformStats = (transform: (old: SongUserStats) => SongUserStats) =>
  withSong((song: Song): Song => {
    song.songStats = transform(song.songStats);
    return song;
  });

const updateStats = (old: UserStats): UserStats => ({
  id: old.id,
  lastPlayed: now(),
});

const updateSongStats = (old: SongUserStats): SongUserStats => ({
  id: old.id,
  liked: old.liked,
  playCount: old.playCount + 1,
});

export type PlaySongArgs = {
  songId: string,
  artistId?: string,
  albumId?: string,
  playlistId?: string,
};

const playSong = (
  _: void,
  { songId, artistId, albumId, playlistId }: PlaySongArgs
): StatsCollection => {
  const validDescriptors = [artistId, albumId, playlistId].filter(
    descriptor => !!descriptor
  );

  if (validDescriptors.length > 1) {
    throw new TypeError(
      'Multiple valid descriptors were passed: ' +
        validDescriptors.join() +
        '. Only one should be passed.'
    );
  }

  const song: Song = mustGet(songs, songId);
  song.stats = updateStats(song.stats);
  song.songStats = updateSongStats(song.songStats);

  const album: Album | void = albumId ? mustGet(albums, albumId) : undefined;
  const artist: Artist | void = artistId
    ? mustGet(artists, artistId)
    : undefined;
  const playlist: Playlist | void = playlistId
    ? mustGet(playlists, playlistId)
    : undefined;

  if (album) {
    album.stats = updateStats(album.stats);
  }

  if (artist) {
    artist.stats = updateStats(artist.stats);
  }

  if (playlist) {
    playlist.stats = updateStats(playlist.stats);
  }

  return {
    song,
    albumStats: album && album.stats,
    artistStats: artist && artist.stats,
    playlistStats: playlist && playlist.stats,
  };
};

const mutation = {
  Mutation: {
    toggleLike: transformStats(old => ({
      id: old.id,
      playCount: old.playCount,
      liked: !old.liked,
    })),
    playSong,
  },
};

export default mutation;
