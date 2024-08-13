import { ApolloClient, InMemoryCache } from '@apollo/client';

const cache = new InMemoryCache();

const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql',
  cache,
});

export default client;