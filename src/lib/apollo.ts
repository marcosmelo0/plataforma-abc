import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
    uri: 'https://sa-east-1.cdn.hygraph.com/content/clyp5o64i00u808w8q1vv8j4u/master',
    cache: new InMemoryCache()
})