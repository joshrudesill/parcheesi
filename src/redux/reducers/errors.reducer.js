import { createSlice } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

const errorSlice = createSlice({
  name: "errors",
  initialState: { loginMessage: "", registrationMessage: "" },
  reducers: {
    clearLoginError: (state, action) => {
      state.loginMessage = "";
    },
    loginInputError: (state) => {
      state.loginMessage = "Enter your username and password!";
    },
    loginFailed: (state) => {
      state.loginMessage =
        "Oops! The username and password didn't match. Try again!";
    },
    loginFailedNoCode: (state) => {
      state.loginMessage = "Oops! Something went wrong! Is the server running?";
    },
    clearRegistrationError: (state) => {
      state.registrationMessage = "";
    },
    registrationInputError: (state) => {
      state.registrationMessage = "Choose a username and password!";
    },
    registrationFailed: (state) => {
      state.registrationMessage =
        "Oops! That didn't work. The username might already be taken. Try again!";
    },
  },
});
// loginMessage holds the string that will display
// on the login screen if there's an error
const loginMessage = (state = "", action) => {
  switch (action.type) {
    case "CLEAR_LOGIN_ERROR":
      return "";
    case "LOGIN_INPUT_ERROR":
      return "Enter your username and password!";
    case "LOGIN_FAILED":
      return "Oops! The username and password didn't match. Try again!";
    case "LOGIN_FAILED_NO_CODE":
      return "Oops! Something went wrong! Is the server running?";
    default:
      return state;
  }
};

// registrationMessage holds the string that will display
// on the registration screen if there's an error
const registrationMessage = (state = "", action) => {
  switch (action.type) {
    case "CLEAR_REGISTRATION_ERROR":
      return "";
    case "REGISTRATION_INPUT_ERROR":
      return "Choose a username and password!";
    case "REGISTRATION_FAILED":
      return "Oops! That didn't work. The username might already be taken. Try again!";
    default:
      return state;
  }
};

// make one object that has keys loginMessage, registrationMessage
// these will be on the redux state at:
// state.errors.loginMessage and state.errors.registrationMessage

export const {
  clearLoginError,
  loginInputError,
  loginFailed,
  loginFailedNoCode,
  clearRegistrationError,
  registrationFailed,
  registrationInputError,
} = errorSlice.actions;
export default errorSlice.reducer;
