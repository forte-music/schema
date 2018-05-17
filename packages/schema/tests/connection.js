// Tests a connection for conformance. getConnection is an async function
// which must return a connection of at least 3 items.
export const testConnection = (connectionName, getConnection) => {
  const handledGetConnection = async (...args) => {
    const connection = await getConnection(...args);
    if (!connection) {
      throw new TypeError("getConnection didn't return a connection");
    }

    return connection;
  };

  describe(`${connectionName} connection`, () => {
    it('should get all items when limit is -1', async () => {
      const connection = await handledGetConnection({ first: -1 });

      expect(connection.count).toBeTruthy();
      expect(connection.pageInfo.hasNextPage).toBe(false);
      expect(connection.edges).toHaveLength(connection.count);
    });

    it('should get the first limit items', async () => {
      const limit = 2;
      const connection = await handledGetConnection({ first: limit });

      expect(connection.pageInfo.hasNextPage).toBe(
        connection.edges.length < connection.count
      );
      expect(connection.edges).toHaveLength(limit);
    });

    it('should get first limit items from a cursor', async () => {
      const limitFromCursor = 2;
      const mapIdObj = ({ node: { id } }) => ({ id });
      const fullConnection = await handledGetConnection({ first: 20 });

      if (fullConnection.edges.length <= 2) {
        throw new TypeError(
          'Not enough edges were returned for this test to work'
        );
      }

      const limitFromEdgeIdx =
        fullConnection.edges.length - 1 - limitFromCursor;
      const startFromEdge = fullConnection.edges[limitFromEdgeIdx];
      const expectedNodes = fullConnection.edges
        .slice(limitFromEdgeIdx + 1)
        .map(mapIdObj);

      const cursoredConnection = await handledGetConnection({
        after: startFromEdge.cursor,
        first: limitFromCursor,
      });

      const actualNodes = cursoredConnection.edges.map(mapIdObj);

      expect(actualNodes).toMatchObject(expectedNodes);
      expect(cursoredConnection.pageInfo).toMatchObject(
        fullConnection.pageInfo
      );
    });
  });
};
