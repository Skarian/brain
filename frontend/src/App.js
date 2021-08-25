import { Helmet } from 'react-helmet';
import UserProvider from './context/userContext';
import { Toaster } from 'react-hot-toast';
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink } from '@apollo/client';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { PrivateRoute } from './pages/PrivateRoute';

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
          <BrowserRouter>
            <Switch>
              <PrivateRoute to="/dashboard" />
              <Route path="/" render={() => <div>Oops you broke something...404 error</div>} />
            </Switch>
          </BrowserRouter>
        </UserProvider>
      </ApolloProvider>
    </div>
  );
}

export default App;

// Make a Link in React Router

// import Link from "react-router-doom"

// <Link to="/about">About Page</Link>

// Push Router, extract {history} from props

// history.push('/about')
