const testSort = testName => {
  const testSortOrder = order => {
    it(`should sort by ${order}`, () => {
      // TODO: Implement
    });

    it(`should reverse sort by ${order}`, () => {
      // TODO: Implement
    });
  };

  const testFilterAndSort = (order, filter) => {
    it(`should sort by ${order} and filter by ${filter}`, () => {
      // TODO: Implement
    });
  };

  describe(`${testName} connection sort`, () => {
    testSortOrder('RECENTLY_ADDED');
    testSortOrder('LEXICOGRAPHICALLY');
    testSortOrder('RECENTLY_PLAYED');
    testSortOrder('MOST_PLAYED');

    // TODO: Implement
  });
};
