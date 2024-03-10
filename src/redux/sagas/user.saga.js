import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";
import { setUser } from "../reducers/user.reducer";

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchUser() {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const response = yield axios.get("/api/user", config);

    // now that the session has given us a user object
    // with an id and username set the client-side user object to let
    // the client-side code know the user is logged in
    yield put(setUser(response.data));
  } catch (error) {
    console.log("User get request failed", error);
  }
}

function* userSaga() {
  yield takeLatest("FETCH_USER", fetchUser);
}

export default userSaga;
