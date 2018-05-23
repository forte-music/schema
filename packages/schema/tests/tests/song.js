import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';

import { testConnection } from '../connection';
import { testSort } from '../sort';
import SongFields from './fragments/SongFields.graphql';
import AlbumFields from './fragments/AlbumFields.graphql';
import ArtistFields from './fragments/ArtistFields.graphql';
import UserStatsFields from './fragments/UserStatsFields.graphql';
import SongUserStatsFields from './fragments/SongUserStatsFields.graphql';

import client from '../client';
import { uuidForNum } from '../utils';

const variables = { songId: uuidForNum(2) };
it('should get a song by id', async () => {
  const query = gql`
    query($songId: ID!) {
      song(id: $songId) {
        ...SongFields

        album {
          ...AlbumFields
        }

        artists {
          ...ArtistFields
        }

        stats {
          ...UserStatsFields
        }

        songStats {
          ...SongUserStatsFields
        }
      }
    }

    ${SongFields}
    ${AlbumFields}
    ${ArtistFields}
    ${UserStatsFields}
    ${SongUserStatsFields}
  `;

  const data = await client.request(print(query), variables);

  expect(data).toMatchSnapshot();
});

it('should get all items when limit is -1', async () => {
  const { songs } = await client.request(
    `
      query {
        songs(first: -1) {
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
    `
  );

  expect(songs.count).toBeTruthy();
  expect(songs.count).toEqual(songs.edges.length);
});

testConnection('songs', async ({ first, after }) => {
  const query = gql`
    query($first: Int, $after: String) {
      songs(first: $first, after: $after) {
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

  const { songs } = await client.request(print(query), {
    first,
    after,
  });

  return songs;
});

testSort('songs', async ({ sortBy, reverse }) => {
  const query = gql`
    query($sortBy: SortBy!, $reverse: Boolean!) {
      songs(first: -1, sort: { sortBy: $sortBy, reverse: $reverse }) {
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

  const { songs: { edges } } = await client.request(print(query), {
    sortBy,
    reverse,
  });

  return edges.map(({ node }) => node);
});
