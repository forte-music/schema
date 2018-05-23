import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';

import { testConnection } from '../connection';
import { testSort } from '../sort';
import AlbumFields from './fragments/AlbumFields.graphql';
import ArtistFields from './fragments/ArtistFields.graphql';
import SongFields from './fragments/SongFields.graphql';
import UserStatsFields from './fragments/UserStatsFields.graphql';

import client from '../client';
import { uuidForNum } from '../utils';

const variables = { albumId: uuidForNum('4') };
it('should get an album by id', async () => {
  const query = gql`
    query($albumId: ID!) {
      album(id: $albumId) {
        ...AlbumFields

        artist {
          ...ArtistFields
        }

        songs {
          ...SongFields
        }
      }
    }

    ${AlbumFields}
    ${ArtistFields}
    ${SongFields}
  `;

  const { album } = await client.request(print(query), variables);

  expect(album).toMatchSnapshot();
});

it('should calculate the duration for an album', async () => {
  const { album } = await client.request(
    `
      query($albumId: ID!) {
        album(id: $albumId) {
          id
          duration
        }
      }
    `,
    variables
  );

  expect(album).toMatchObject({
    id: variables.albumId,
    duration: 74 * 60 + 22,
  });
});

testConnection('albums', async ({ first, after }) => {
  const query = gql`
    query($first: Int, $after: String) {
      albums(first: $first, after: $after) {
        count
        pageInfo {
          hasNextPage
        }

        edges {
          cursor

          node {
            id
          }
        }
      }
    }
  `;

  const { albums } = await client.request(print(query), {
    first,
    after,
  });

  return albums;
});

testSort('albums', async ({ sortBy, reverse }) => {
  const query = gql`
    query($sortBy: SortBy!, $reverse: Boolean!) {
      albums(first: -1, sort: { sortBy: $sortBy, reverse: $reverse }) {
        edges {
          node {
            id
            name
            timeAdded
            stats {
              ...UserStatsFields
            }
          }
        }
      }
    }

    ${UserStatsFields}
  `;

  const { albums: { edges } } = await client.request(print(query), {
    sortBy,
    reverse,
  });

  return edges.map(({ node }) => node);
});
