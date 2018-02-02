// @flow
import queryResolvers from './query';
import mutationResolvers from './mutation';

// Resolvers for mock backend.
const resolvers = {
  ...queryResolvers,
  ...mutationResolvers,
};

export default resolvers;
