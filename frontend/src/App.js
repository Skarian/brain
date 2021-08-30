import { Helmet } from 'react-helmet';
import UserProvider from './context/userContext';
import { Toaster } from 'react-hot-toast';
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink } from '@apollo/client';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { PrivateRoute } from './pages/PrivateRoute';
import { StateMachineProvider, createStore } from 'little-state-machine';

createStore(
  {
    upload: [],
  }
  // {
  //   storageType: sessionStorage,
  // }
);

const createApolloClient = () => {
  return new ApolloClient({
    link: new HttpLink({
      uri: process.env.NODE_ENV === 'development' ? 'http://localhost:8080/v1/graphql' : '/hasura',
      headers: {
        'X-Hasura-Admin-Secret': `${process.env.REACT_APP_HASURA}`,
      },
    }),
    cache: new InMemoryCache(),
  });
};
function App() {
  const client = createApolloClient();
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Welcome to CSO Brain!</title>
        <meta name="description" content="A central repository of information" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Helmet>
      <StateMachineProvider>
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
      </StateMachineProvider>
    </div>
  );
}

export default App;

// Make a Link in React Router

// import Link from "react-router-doom"

// <Link to="/about">About Page</Link>

// Push Router, extract {history} from props

// history.push('/about')
