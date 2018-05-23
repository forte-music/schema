export const uuidForNum = num =>
  num
    .toString(16)
    .toLowerCase()
    .padStart(32, '0');
