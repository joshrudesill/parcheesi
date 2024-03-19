import React, { useEffect, useState } from "react";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
  Link,
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

import "../../index.css";
import Play from "../Play/Play";
import Lobby from "../Lobby/Lobby";
import {
  addPlayer,
  gameReset,
  setAdmin,
  setGame,
  setGameStarted,
  setTurn,
} from "../../redux/reducers/game.reducer";
import Game from "../Game/Game";
import axios from "axios";
import { parseGameIntoMemory } from "../../parcheesi";
import LogOutButton from "../LogOutButton/LogOutButton";

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

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.onAny((event, ...args) => {
      console.log(event, args);
    });
    socket.on("player-joined", (player) => {
      dispatch(addPlayer(player));
    });
    socket.on("leaving-gameroom", (player) => {
      dispatch(addPlayer(player));
    });
    socket.on("gameover", (reason, player) => {
      console.log(reason, player);
      if (reason === "player-won") {
        alert(`${player} won`);
      }
      dispatch(gameReset());
      console.log("gameover");
      // all users should be updated
      dispatch({ type: "FETCH_USER" });
    });
    socket.on("game-start", () => {
      dispatch(setGameStarted(true));
    });
    socket.on("advance-turn", async (cg) => {
      const currentGame = await axios.get("/api/game/cgs", {
        params: { game: cg },
      });
      console.log("CGGGG:", currentGame);
      dispatch(setTurn(currentGame.data.turn - 1));
      parseGameIntoMemory(
        currentGame.data["piece_positions"],
        2,
        currentGame.data["turn"],
        (gs) => dispatch(setGame(gs))
      );
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("player-joined", onDisconnect);
      socket.off("leaving-gameroom", onDisconnect);
    };
  }, []);
  const t = () => {
    socket.emit("hello");
  };

  return (
    <Router>
      <div className='bg-gradient-to-br from-slate-600 via-slate-500 to-slate-900 h-[1100px] p-2 '>
        <div className='flex flex-row gap-1'>
          <Link to='/'>
            <h1 className='px-4 py-2 rounded-md border border-black  text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 '>
              Home
            </h1>
          </Link>
          {user.id && (
            <>
              <LogOutButton className='navLink' />
            </>
          )}
        </div>
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
            // logged in shows UserPage else shows LoginPage
            exact
            path='/game'
          >
            <Game />
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
              <InfoPage />
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
