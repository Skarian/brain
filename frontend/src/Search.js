import React from 'react';
import { gql, useQuery } from '@apollo/client';
import Loading from './loading';
import Unapproved from './Unapproved';
import Approved from './Approved';

const TEST = gql`
  query MyQuery($email: String!) {
    approved_users_by_pk(user_email: $email) {
      isKM
      user_email
    }
  }
`;
const Search = ({ user }) => {
  const { loading, error, data } = useQuery(TEST, {
    variables: { email: user.email },
  });
  console.log(`Secret Hasura = ${process.env.REACT_APP_HASURA}`);
  if (error) {
    console.log(error);
    return <Unapproved user={user} />;
  }
  if (loading) {
    return <Loading />;
  }
  if (data) {
    if (data.approved_users_by_pk === null) {
      return <Unapproved user={user} />;
    }
    return <Approved user={user} isKM={data.approved_users_by_pk.isKM} />;
  }
};

export default Search;
