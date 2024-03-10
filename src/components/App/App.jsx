import React, { useEffect, useState } from "react";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import Nav from "../Nav/Nav";

import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";

import UserPage from "../UserPage/UserPage";
import InfoPage from "../InfoPage/InfoPage";
import LandingPage from "../LandingPage/LandingPage";
import LoginPage from "../LoginPage/LoginPage";
import RegisterPage from "../RegisterPage/RegisterPage";
import { socket } from "../../../socket";

import "./App.css";
import Play from "../Play/Play";
import Lobby from "../Lobby/Lobby";

function App() {
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user.currentUser);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);

  useEffect(() => {
    dispatch({ type: "FETCH_USER" });
  }, [dispatch]);
  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value) {
      setFooEvents((previous) => [...previous, value]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("hi", onFooEvent);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("hi", onFooEvent);
    };
  }, []);
  const t = () => {
    socket.emit("hello");
  };

  return (
    <Router>
      <div>
        <Nav />
        <div>{isConnected ? "CONN" : "N-CONN"}</div>
        <div>{JSON.stringify(fooEvents)}</div>
        <button onClick={t}>Emit</button>
        <Switch>
          {/* Visiting localhost:5173 will redirect to localhost:5173/home */}
          <Redirect exact from='/' to='/home' />

          {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:5173/user will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the LoginPage (component).
            Even though it seems like they are different pages, the user is always on localhost:5173/user */}
          <ProtectedRoute
            // logged in shows UserPage else shows LoginPage
            exact
            path='/user'
          >
            <UserPage />
          </ProtectedRoute>
          <ProtectedRoute
            // logged in shows UserPage else shows LoginPage
            exact
            path='/play'
          >
            <Play />
          </ProtectedRoute>
          <ProtectedRoute
            // logged in shows UserPage else shows LoginPage
            exact
            path='/lobby'
          >
            <Lobby />
          </ProtectedRoute>

          <ProtectedRoute
            // logged in shows InfoPage else shows LoginPage
            exact
            path='/info'
          >
            <InfoPage />
          </ProtectedRoute>

          <Route exact path='/login'>
            {user.id ? (
              // If the user is already logged in,
              // redirect to the /user page
              <Redirect to='/play' />
            ) : (
              // Otherwise, show the login page
              <LoginPage />
            )}
          </Route>

          <Route exact path='/registration'>
            {user.id ? (
              // If the user is already logged in,
              // redirect them to the /user page
              <Redirect to='/play' />
            ) : (
              // Otherwise, show the registration page
              <RegisterPage />
            )}
          </Route>

          <Route exact path='/home'>
            {user.id ? (
              // If the user is already logged in,
              // redirect them to the /user page
              <Redirect to='/play' />
            ) : (
              // Otherwise, show the Landing page
              <LandingPage />
            )}
          </Route>

          {/* If none of the other routes matched, we will show a 404. */}
          <Route>
            <h1>404</h1>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
