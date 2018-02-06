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
  playCount: old.playCount + 1,
  lastPlayed: now(),
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

type CreatePlaylistArgs = {
  name: string,
  description?: string,
  songs: string[],
};

const createPlaylist = (
  _: void,
  { name, description, songs: songIds }: CreatePlaylistArgs
): Playlist => {
  const playlistSource: PlaylistSource = {
    id: `playlist:${randomInt()}`,
    name,
    description,
    songIds,
  };

  const playlist = connectPlaylist(playlistSource);
  addToMap(playlists, playlist);

  return playlist;
};

export type UpdatePlaylistArgs = {
  playlistId: string,
  name?: string,
  description?: string,
};

const updatePlaylist = (
  _: void,
  { playlistId, name, description }: UpdatePlaylistArgs
) => {
  if (!name && !description) {
    throw new TypeError(
      'Invalid arguments. One of name or description must be provided'
    );
  }

  const playlist = mustGet(playlists, playlistId);
  if (name) {
    playlist.name = name;
  }

  if (description) {
    playlist.description = description;
  }

  return playlist;
};

const deletePlaylist = (_: void, { playlistId }: { playlistId: string }) => {
  playlists.delete(playlistId);

  return true;
};

const mutation = {
  Mutation: {
    toggleLike: transformStats(old => ({ id: old.id, liked: !old.liked })),
    playSong,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
  },
};

export default mutation;
