import React from 'react';
import Upload from './Upload';

const Content = ({ page }) => {
  if (page === 'Search') {
    return <div>Search</div>;
  }
  if (page === 'Projects') {
    return <div>Projects</div>;
  }
  if (page === 'KM') {
    return <Upload />;
  }
};

export default Content;
