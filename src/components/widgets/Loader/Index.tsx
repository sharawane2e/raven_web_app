import React from 'react';

type Props = {};

const Loader = () => {
  return (
    <div className="loader--wrapper">
      <div className="loading">
        <div className="loading-1"></div>
        <div className="loading-2"></div>
        <div className="loading-3"></div>
        <div className="loading-4"></div>
      </div>
    </div>
  );
};

export default Loader;
