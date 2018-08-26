import { artists } from '@forte-music/schema/fixtures/artists';
import { ArtistSource } from '@forte-music/schema/fixtures/artists';
import { arrayPropertyDescriptor, makeMap, uuidForNum } from '../utils';
import { albums } from '.';
import { Album, UserStats } from '.';
import { withUserStats } from './stats';

export interface Artist {
  id: string;
  name: string;
  timeAdded: number;

  albums: Album[];
  collageArtwork: string[];
  stats: UserStats;
}

const connectArtist = (artist: ArtistSource): Artist => {
  const id = uuidForNum(artist.id);
  const albumIds = artist.albumIds.map(id => uuidForNum(id));

  return Object.defineProperties(
    {
      id,
      name: artist.name,
      timeAdded: artist.timeAdded || 0,
      stats: withUserStats({ id, stats: artist.stats }),
    },
    {
      albums: arrayPropertyDescriptor(() => albums, albumIds),
      collageArtwork: {
        get(this: Artist) {
          const withArtwork = this.albums
            .filter(album => album.artworkUrl)
            .map(album => album.artworkUrl);
          const topArtwork = withArtwork.slice(0, 4);

          return topArtwork;
        },
      },
    }
  );
};

const processedArtists: Map<string, Artist> = makeMap(
  artists.map(connectArtist)
);

export default processedArtists;
