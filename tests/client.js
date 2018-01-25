import { HttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

// In the browser, by default, this client will send queries to the `/graphql`
// endpoint on the same host.
const link = new HttpLink({ uri: API_URL });
const cache = new InMemoryCache();
const client = new ApolloClient({ link, cache });

export default client;
