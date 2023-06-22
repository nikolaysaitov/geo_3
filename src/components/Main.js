import React, { useState } from "react";
import withLayout from '../components/WithLayout/WithLayout';
import { connect } from "react-redux";

function Main({ onVerifyToken, userGroup }) {

  useState(() => {
    onVerifyToken();
    const intervalId = setInterval(onVerifyToken, 1000 * 60 * 100); // re-verify token every 10 minutes
    return () => clearInterval(intervalId);
  }, [onVerifyToken]);


  return (
    <div className="container">
      <h1>Main.js, Ваша группа: {userGroup}</h1>

    </div>
  );
}


function mapStateToProps(state) {
  return {
    userGroup: state.userGroup
  };
}

export default connect(mapStateToProps)(withLayout(Main));