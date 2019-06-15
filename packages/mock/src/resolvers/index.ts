import queryResolvers from './query/query';
import mutationResolvers from './mutations';

// Resolvers for mock backend.
const resolvers = {
  ...queryResolvers,
  ...mutationResolvers,
};

export default resolvers;
