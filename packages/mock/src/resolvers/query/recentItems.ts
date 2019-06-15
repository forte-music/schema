import { Album, albums, Artist, artists } from '../../models/index';
import { reverseCompare } from './sort';

interface RecentItemQueryArgs {
  first: number;
}

type AnnotatedAlbum = Album & { kind: 'Album' };

type AnnotatedArtist = Artist & { kind: 'Artist' };

type AnnotatedRecentItem = AnnotatedAlbum | AnnotatedArtist;

type RecentItem = Album | Artist;

const annotateAlbum = (album: Album): AnnotatedAlbum => ({
  kind: 'Album',
  ...album,
});

const annotateArtist = (artist: Artist): AnnotatedArtist => ({
  kind: 'Artist',
  ...artist,
});

const getAnnotatedAlbums = () => [...albums.values()].map(annotateAlbum);

const getAnnotatedArtists = () => [...artists.values()].map(annotateArtist);

const getAnnotatedItems = (): AnnotatedRecentItem[] => [
  ...getAnnotatedAlbums(),
  ...getAnnotatedArtists(),
];

const getMostRecent = (
  allItems: AnnotatedRecentItem[],
  top: number,
  timeGetter: (item: AnnotatedRecentItem) => number
) => {
  allItems.sort((a: AnnotatedRecentItem, b: AnnotatedRecentItem) =>
    reverseCompare(timeGetter(a), timeGetter(b))
  );

  return allItems.slice(0, top);
};

export const recentlyAdded = (
  _: void,
  { first }: RecentItemQueryArgs
): RecentItem[] =>
  getMostRecent(getAnnotatedItems(), first, item => item.timeAdded);

export const recentlyPlayed = (
  _: void,
  { first }: RecentItemQueryArgs
): RecentItem[] =>
  getMostRecent(
    getAnnotatedItems().filter(item => !!item.lastPlayed),
    first,
    item => item.lastPlayed as number
  );

export const RecentItem = {
  __resolveType(item: AnnotatedRecentItem) {
    return item.kind;
  },
};
