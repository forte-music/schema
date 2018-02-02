// @flow
export type UserStats = {
  playCount?: number,
  lastPlayed?: number,
};

export type SongUserStats = UserStats & {
  liked?: boolean,
};
