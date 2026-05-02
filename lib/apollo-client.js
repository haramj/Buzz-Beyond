// lib/apollo-client.js
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

// uri 대신 createHttpLink를 사용하여 명시적으로 연결을 설정합니다.
const link = createHttpLink({
  uri: "http://localhost:3000/api/graphql",
});

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});

export default client;