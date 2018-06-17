export interface UserStats {
  lastPlayed?: number;
}

export interface SongUserStats extends UserStats {
  playCount?: number;
  liked?: boolean;
}
