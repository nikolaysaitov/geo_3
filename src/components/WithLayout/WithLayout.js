import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const withLayout = (WrappedComponent) => {
  return function WithLayout(props) {
    return (
      <div className="layout">
        <Header />
        <WrappedComponent {...props} />
        <Footer />
      </div>
    );
  };
};

export default withLayout;
