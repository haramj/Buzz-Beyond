// pages/_app.js
import { ApolloProvider } from "@apollo/client/index.js"; // 경로 끝에 .js 또는 명시적 경로 확인
import client from "../lib/apollo-client";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;