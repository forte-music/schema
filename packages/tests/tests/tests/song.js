import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';

import { testConnection } from '../connection';
import { testSort } from '../sort';
import SongFields from './fragments/SongFields.graphql';
import AlbumFields from './fragments/AlbumFields.graphql';
import ArtistFields from './fragments/ArtistFields.graphql';

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
      }
    }

    ${SongFields}
    ${AlbumFields}
    ${ArtistFields}
  `;

  const data = await client.request(print(query), variables);

  expect(data).toMatchSnapshot();
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
            lastPlayed
          }
        }
      }
    }
  `;

  const {
    songs: { edges },
  } = await client.request(print(query), {
    sortBy,
    reverse,
  });

  return edges.map(({ node }) => node);
});
