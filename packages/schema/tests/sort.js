const comparator = (a, b) => {
  if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  } else {
    return 0;
  }
};

const reverse = inner => (a, b) => inner(b, a);

const reverseSort = reverse(comparator);

// A stable sort. JavaScript's sort isn't stable.
function stableSort(arr, compare) {
  const original = arr.slice(0);

  arr.sort((a, b) => {
    const result = compare(a, b);
    return result === 0 ? original.indexOf(a) - original.indexOf(b) : result;
  });

  return arr;
}

const testSortOrder = (sortBy, testName, querySortable, comparator) => {
  const check = shouldReverse => async () => {
    const sortable = await querySortable({ sortBy, reverse: shouldReverse });

    if (shouldReverse) {
      comparator = reverse(comparator);
    }

    const got = sortable.slice();
    const expected = stableSort(sortable, comparator);

    expect(got).toEqual(expected);
  };

  it(`should sort by ${sortBy}`, check(false));

  it(`should reverse sort by ${sortBy}`, check(true));
};

export const testSort = (testName, querySortable) => {
  const t = (order, compare) =>
    testSortOrder(order, testName, querySortable, compare);

  describe(`${testName} connection sort`, () => {
    t('RECENTLY_ADDED', (a, b) => reverseSort(a.timeAdded, b.timeAdded));

    t('LEXICOGRAPHICALLY', (a, b) => comparator(a.name, b.name));

    t('RECENTLY_PLAYED', (a, b) =>
      reverseSort(a.stats.lastPlayed, b.stats.lastPlayed)
    );

    t('MOST_PLAYED', (a, b) =>
      reverseSort(a.stats.playCount, b.stats.playCount)
    );
  });
};
