import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import SignIn from "./SignIn/SignIn";
import SignUp from "./SignUp/SignUp";
import Cars from "./Cars/Cars";
import Couriers from "./Couriers/Couriers";
import Dispatchers from "./Dispatchers/Dispatchers";
import Managers from "./Managers/Managers";
import Routes from "./Routes/Routes";
import Main from "./Main";
import Districts from './Districts/Districts'
import CourierMain from "../components/CouriersAccount/CourierMain";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import { _apiBase } from "../services/Api";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css"; //core css
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import './App.css';

function App() {
  const [isLoggedIn, setLoggedIn] = useState(!!localStorage.getItem("access"));
  // const [userGroup, setUserGroup] = useState("");

  function handleLogin(data) {
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    setLoggedIn(true);
  }

  async function handleVerifyToken() {
    const token = localStorage.getItem("access");
    if (!token) {
      setLoggedIn(false);
      console.log("token is off");
      return;
    }

    const response = await fetch(`${_apiBase}/auth/jwt/verify/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (response.ok) {
      setLoggedIn(true);
      console.log("token check");
    } else {
      setLoggedIn(false);
      console.log("token is off");
    }
  }
  console.log("isLoggedIn:", isLoggedIn);

  //Проверяем группу пользователя и записываем в стор редакс
  const userGroup = useSelector((state) => state.userGroup);

  const dispatch = useDispatch();
  useEffect(() => {
    const HandleVerifyGroup = async () => {
      try {
        const token = localStorage.getItem("access");
        const response = await fetch(`${_apiBase}/auth/users/me/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
          },
        });

        if (response.ok) {
          const user = await response.json();
          dispatch({ type: "SET_USER_GROUP", payload: user.group });
          dispatch({ type: "SET_USER_NAME", payload: user.name });
          dispatch({ type: "SET_USER_SURNAME", payload: user.surname });
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
          console.log("token is off");
        }
      } catch (error) {
        setLoggedIn(false);
        console.log("token is off");
      }
    };
    HandleVerifyGroup();
  }, [dispatch]);

  return (
    <>
      <Router>
        <Route path="/signup">{<SignUp onLogin={handleLogin} />}</Route>
        <Route path="/signin">{<SignIn onLogin={handleLogin} />}</Route>

        {userGroup === "Courier" && (
          <>
            <Route path="/courier_acc">
              <CourierMain />
            </Route>
          </>
        )}

        {userGroup === "Owner" && (
          <>
            <Route path="/cars">
              <Cars />
            </Route>
            <Route path="/dispatchers">
              <Dispatchers />
            </Route>
            <Route path="/managers">
              <Managers />
            </Route>
            <Route path="/couriers">
              <Couriers />
            </Route>
            <Route path="/routes">
              <Routes />
            </Route>
            <Route path="/districts">
              <Districts />
            </Route>
          </>
        )}
        {userGroup === "Dispatcher" && (
          <>
            <Route path="/cars">
              <Cars />
            </Route>
            <Route path="/couriers">
              <Couriers />
            </Route>
            <Route path="/routes">
              <Routes />
            </Route>
            <Route path="/districts">
              <Districts />
            </Route>
          </>
        )}
        {userGroup === "Manager" && (
          <>
            <Route path="/cars">
              <Cars />
            </Route>
            <Route path="/dispatchers">
              <Dispatchers />
            </Route>
            <Route path="/couriers">
              <Couriers />
            </Route>
            <Route path="/routes">
              <Routes />
            </Route>
            <Route path="/districts">
              <Districts />
            </Route>
           
          </>
        )}


        <Route exact path="/">
          {!isLoggedIn ? <Redirect to="/signup" /> : <Main onVerifyToken={handleVerifyToken} isLoggedIn={isLoggedIn} />}
        </Route>

        {/* <Route exact path="/">
          {!isLoggedIn ? (
            <Redirect to="/signup" />
          ) : (
            <ProtectedRoute path="/" component={Main} onVerifyToken={handleVerifyToken} isLoggedIn={isLoggedIn} />
          )}
        </Route> */}
      </Router>
    </>
  );
}

export default App;
