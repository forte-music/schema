import { Connection } from '../../models';

export interface ConnectionArgs {
  after?: string;
  first?: number;
}

export const handleConnection = <InputType, NodeType>(
  keys: InputType[],
  getNode: (key: InputType) => NodeType,
  { first = 25, after }: ConnectionArgs
): Connection<NodeType> => {
  const lowerBound = after ? parseInt(after, 10) + 1 : 0;
  const upperBound = first === -1 ? keys.length : lowerBound + first;

  const acceptedKeys = keys.slice(lowerBound, upperBound);

  return {
    count: keys.length,
    pageInfo: {
      hasNextPage: upperBound < keys.length,
    },
    edges: acceptedKeys.map((key, index) => ({
      cursor: (index + lowerBound).toString(),
      node: getNode(key),
    })),
  };
};
