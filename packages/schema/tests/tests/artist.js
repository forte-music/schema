import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';

import { testConnection } from '../connection';
import { testSort } from '../sort';

import UserStatsFields from './fragments/UserStatsFields.graphql';

import client from '../client';

testConnection('artists', async ({ first, after }) => {
  const query = gql`
    query($first: Int, $after: String) {
      artists(first: $first, after: $after) {
        pageInfo {
          count
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
            stats {
              ...UserStatsFields
            }
          }
        }
      }
    }

    ${UserStatsFields}
  `;

  const { artists: { edges } } = await client.request(print(query), {
    sortBy,
    reverse,
  });

  return edges.map(({ node }) => node);
});
