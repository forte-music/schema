// @flow
export type UserStats = {
  lastPlayed?: number,
};

export type SongUserStats = UserStats & {
  playCount?: number,
  liked?: boolean,
};
