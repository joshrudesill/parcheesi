import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import logger from "redux-logger";

import { rootReducer } from "./reducers/_root.reducer"; // imports ./redux/reducers/index.js
import rootSaga from "./sagas/_root.saga"; // imports ./redux/sagas/index.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/user.reducer";
import errorsReducer from "./reducers/errors.reducer";
import gameReducer from "./reducers/game.reducer";

const sagaMiddleware = createSagaMiddleware();

// this line creates an array of all of redux middleware you want to use
// we don't want a whole ton of console logs in our production code
// logger will only be added to your project if your in development mode
const middlewareList =
  process.env.NODE_ENV === "development"
    ? [sagaMiddleware, logger]
    : [sagaMiddleware];

export default configureStore({
  reducer: { user: userReducer, errors: errorsReducer, game: gameReducer },
  middleware: () => new Array(sagaMiddleware),
  devTools: true,
});
// tells the saga middleware to use the rootSaga
// rootSaga contains all of our other sagas
sagaMiddleware.run(rootSaga);
