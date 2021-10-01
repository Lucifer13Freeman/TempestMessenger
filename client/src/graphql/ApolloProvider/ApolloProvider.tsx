import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider as Provider,
  createHttpLink,
  split
} from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { HTTP_LINK } from "../../constants/links";


//const host = window.location.host;

let http_link = createHttpLink(
{
  uri: HTTP_LINK
  //uri: '/graphql'
});

const auth_link = setContext((_, { headers }) => 
{
  const token = localStorage.getItem('token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  }
});

http_link = auth_link.concat(http_link);

const ws_link = new WebSocketLink(
{
  uri: 'ws://localhost:4000/graphql',
  //uri: `ws://${host}/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
  }
});

const split_link = split(

  ({ query }) => 
  {
    const definition = getMainDefinition(query);

    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  ws_link,
  http_link,
);
  

const client = new ApolloClient(
{
  link: split_link,
  cache: new InMemoryCache()
});

const ApolloProvider = (props: any) =>
{
  return <Provider client={client} {...props}/>
}


export default ApolloProvider;