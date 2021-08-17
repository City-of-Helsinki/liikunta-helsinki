// https://www.apollographql.com/blog/building-a-next-js-app-with-apollo-client-slash-graphql/
export default function initializeApolloClient(
  initialState = null,
  cachedClient,
  createClient
) {
  const _apolloClient = cachedClient ?? createClient();

  // Initial state hydration
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Restore the cache using the data passed from
    // getStaticProps/getServerSideProps combined with the existing cached data
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") {
    return _apolloClient;
  }

  // Create the Apollo Client once in the client
  if (!cachedClient) {
    cachedClient = _apolloClient;
  }

  return _apolloClient;
}
