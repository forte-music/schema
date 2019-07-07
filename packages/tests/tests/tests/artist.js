import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';

import { testConnection } from '../connection';
import { testSort } from '../sort';

import client from '../client';

testConnection('artists', async ({ first, after }) => {
  const query = gql`
    query($first: Int, $after: String) {
      artists(first: $first, after: $after) {
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

  const { artists } = await client.request(print(query), {
    first,
    after,
  });

  return artists;
});

testSort('artists', async ({ sortBy, reverse }) => {
  const query = gql`
    query($sortBy: SortBy!, $reverse: Boolean!) {
      artists(first: -1, sort: { sortBy: $sortBy, reverse: $reverse }) {
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
    artists: { edges },
  } = await client.request(print(query), {
    sortBy,
    reverse,
  });

  return edges.map(({ node }) => node);
});
