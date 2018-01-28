// Tests a connection for conformance. getConnection is an async function
// which must return a connection of at least 3 items.
const testConnection = (connectionName, getConnection) => {
  describe(`${connectionName} connection`, () => {
    it('should get all items when limit is -1', async () => {
      const connection = await getConnection({ first: -1 });
      if (!connection) {
        throw new TypeError("getConnection didn't return a connection");
      }

      expect(connection.pageInfo.count).toBeTruthy();
      expect(connection.edges).toHaveLength(connection.pageInfo.count);
    });

    it('should get the first limit items', async () => {
      const limit = 2;
      const connection = await getConnection({ first: limit });

      expect(connection.edges).toHaveLength(limit);
    });

    it('should get first limit items from a cursor', async () => {
      const limitFromCursor = 2;
      const fullConnection = await getConnection({ first: 20 });
      if (fullConnection.edges.length <= limitFromCursor) {
        throw new TypeError(
          'Not enough edges were returned for this test to work'
        );
      }

      const limitFromEdgeIdx =
        fullConnection.edges.length - 1 - limitFromCursor;
      const startFromEdge = fullConnection.edges[limitFromEdgeIdx];
      const expectedNodes = fullConnection.edges
        .slice(limitFromEdgeIdx + 1)
        .map(({ node: { id } }) => ({ id }));

      const cursoredConnection = await getConnection({
        after: startFromEdge.cursor,
        first: limitFromCursor,
      });

      const actualNodes = cursoredConnection.edges.map(({ node: { id } }) => ({
        id,
      }));

      expect(actualNodes).toMatch(expectedNodes);
    });
  });
};
