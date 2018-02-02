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
import type { PlaylistInput, PlaySongArgs } from './types';
import type { PlaylistSource } from '@forte-music/schema/fixtures/playlists';

import { albums, artists, playlists, songs } from '../models';
import { addToMap, mustGet, now, randomInt } from '../utils';
import { connectPlaylist } from '../models/playlists';

const withSong = <T>(inner: Song => T) => (
  _: void,
  { songId }: { songId: string }
): T => inner(mustGet(songs, songId));

const transformStats = (transform: (old: SongUserStats) => SongUserStats) =>
  withSong((song: Song): SongUserStats => {
    const { stats } = song;
    const newStats = transform(stats);
    song.stats = newStats;
    return newStats;
  });

const updateStats = (old: UserStats): UserStats => ({
  ...old,
  playCount: old.playCount + 1,
  lastPlayed: now(),
});

const mutation = {
  Mutation: {
    toggleLike: transformStats(old => ({ ...old, liked: !old.liked })),

    playSong: (
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
      song.stats.stats = updateStats(song.stats.stats);

      const album: Album | void = albumId
        ? mustGet(albums, albumId)
        : undefined;
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
        songStats: song.stats,
        albumStats: album && album.stats,
        artistStats: artist && artist.stats,
        playlistStats: playlist && playlist.stats,
      };
    },

    createPlaylist: (
      _: void,
      {
        input: { name, description },
        songs: songIds,
      }: { input: PlaylistInput, songs: string[] }
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
    },
  },
};

export default mutation;
