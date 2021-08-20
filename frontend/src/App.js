import { Helmet } from 'react-helmet';
import Dashboard from './Dashboard';
import UserProvider from './context/userContext';
import { Toaster } from 'react-hot-toast';
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink } from '@apollo/client';

// const createApolloClient = (authToken) => {
const createApolloClient = () => {
  return new ApolloClient({
    link: new HttpLink({
      uri: 'http://147.182.136.107/v1/graphql',
      headers: {
        'X-Hasura-Admin-Secret': `${process.env.REACT_APP_HASURA}`,
      },
    }),
    cache: new InMemoryCache(),
  });
};
function App() {
  // const client = createApolloClient(idToken)
  const client = createApolloClient();
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Welcome to CSO Brain!</title>
        <meta name="description" content="A central repository of information" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Helmet>
      <ApolloProvider client={client}>
        <UserProvider>
          <Toaster position="bottom-center" reverseOrder={false} />
          <Dashboard />
        </UserProvider>
      </ApolloProvider>
    </div>
  );
}

export default App;
