import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";

// HTTP transport Link
const httpLink = new HttpLink({
  uri: "/graphql",
});

// WebSocket transport link
const wsLink = new WebSocketLink({
  uri: `ws://frontapi.qa-rows.com/ws`,
  options: {
    reconnect: true,
    lazy: true,
    connectionParams: {
      auth: sessionStorage.getItem("authToken"),
    },
    connectionCallback: (error) => {
      console.error("caput", error);
    },
  },
});

/**
 * Use WebSockets for subcriptions only, HTTP for everything else
 */
const transportLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = sessionStorage.getItem("authToken");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token,
    },
  };
});

export default new ApolloClient({
  link: authLink.concat(transportLink),
  cache: new InMemoryCache(),
});

export { ApolloProvider } from "@apollo/client";
