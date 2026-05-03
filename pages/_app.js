// pages/_app.js
import { ApolloProvider } from "@apollo/client/index.js";
import client from "../lib/apollo-client";
import "../styles/globals.css";
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Head>
        <title>Weather App - vling Assignment</title>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin=""
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
      </Head>

      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;