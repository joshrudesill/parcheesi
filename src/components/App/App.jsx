import React, { useCallback, useEffect, useState } from "react";
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
import { useHistory } from "react-router-dom";
import Rules from "../Rules/Rules";

function App() {
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user.currentUser);
  const history = useHistory();
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);

  useEffect(() => {
    dispatch({ type: "FETCH_USER" });
  }, [dispatch]);
  const determineWinner = useCallback(
    (reason, player, gameRoom) => {
      dispatch(gameReset());
      if (reason === "player-won") {
        alert(
          `${gameRoom.find((p) => p === player)} won! ${gameRoom.find(
            (p) => p !== player
          )} lost!`
        );
      } else if (reason === "player-lost") {
        alert(
          `${gameRoom.find((p) => p !== player)} won! ${gameRoom.find(
            (p) => p === player
          )} lost!`
        );
      }
      // all users should be updated
      dispatch({ type: "FETCH_USER" });
    },
    [user.username]
  );
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
    socket.on("gameover", (reason, player, gameRoom) => {
      determineWinner(reason, player, gameRoom);
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
  /**
   TODO:
   - Style game.js - add move ui also - 30 min - DONE
   - style user page - 30min - DONE
   - add delete account button - 15min - DONE
   - add w/l to db - 15min - DONE
   - finish game logic to allow for winning properly - 2-3 hours
   - add rules page - 1hour - DONE

   */

  return (
    <Router>
      <div className='bg-gradient-to-br from-neutral-500 via-neutral-400 to-neutral-600 h-screen p-2 '>
        <div className='flex flex-row gap-1'>
          {user.id ? (
            <Link to='/'>
              <h1 className='px-4 py-2 rounded-md border border-black  text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 '>
                {user.username}
              </h1>
            </Link>
          ) : (
            <Link to='/'>
              <h1 className='px-4 py-2 rounded-md border border-black  text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 '>
                Home
              </h1>
            </Link>
          )}
          <Link to='/rules'>
            <h1 className='px-4 py-2 rounded-md border border-black  text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 '>
              Rules
            </h1>
          </Link>

          {user.id && (
            <>
              <Link to='/user'>
                <h1 className='px-4 py-2 rounded-md border border-black  text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 '>
                  Stats
                </h1>
              </Link>
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
          <Route exact path='/rules'>
            <Rules />
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
