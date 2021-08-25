import React from 'react';
import { useUser } from '../context/userContext';
import Loading from './Loading';
import Unapproved from './Unapproved';
import Login from './Login';
import { gql, useQuery } from '@apollo/client';
import Dashboard from '../dashboard/Dashboard';

const USER_APPROVAL = gql`
  query MyQuery($email: String!) {
    users_by_pk(user_email: $email) {
      isKM
      isApproved
      user_email
    }
  }
`;

export const PrivateRoute = () => {
  const { loadingUser, user } = useUser();
  const { loading, error, data } = useQuery(USER_APPROVAL, {
    skip: !user,
    variables: { email: user?.email },
  });

  if (loadingUser) {
    return <Loading />;
  }
  if (user) {
    if (error) {
      console.log(error);
      return <Unapproved user={user} />;
    }
    if (loading) {
      return <Loading />;
    }
    if (data) {
      if (data.users_by_pk && data.users_by_pk.isApproved) {
        return <Dashboard user={user} isKM={data.users_by_pk.isKM} />;
      }
      return <Unapproved user={user} />;
    }
  }

  return <Login />;
};
