// @flow
export type ConnectionArgs = {
  after?: string,
  first?: number,
};

export type PlaySongArgs = {
  songId: string,
  artistId?: string,
  albumId?: string,
  playlistId?: string,
};

export type PlaylistInput = {
  name: string,
  description?: string,
};
