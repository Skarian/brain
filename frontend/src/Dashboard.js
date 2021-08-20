import React, { useEffect } from 'react';
import { useUser } from './context/userContext';
import Login from './Login';
import Search from './Search';
import Loading from './loading';

const Dashboard = () => {
  const { loadingUser, user } = useUser();
  useEffect(() => {
    if (!loadingUser) {
      // You know that the user is loaded: either logged in or out!
      console.log(user);
    }
  }, [loadingUser, user]);

  if (loadingUser) {
    return <Loading />;
  }
  if (user) {
    return <Search user={user} />;
  }

  return <Login />;
};

export default Dashboard;
