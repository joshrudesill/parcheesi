import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { loginInputError } from "../../redux/reducers/errors.reducer";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();

  const login = (event) => {
    event.preventDefault();

    if (username && password) {
      dispatch({
        type: "LOGIN",
        payload: {
          username: username,
          password: password,
        },
      });
    } else {
      dispatch(loginInputError());
    }
  }; // end login

  return (
    <form onSubmit={login}>
      <h2 className='text-2xl font-light mb-3'>Login</h2>
      {errors.loginMessage && (
        <h3 className='alert' role='alert'>
          {errors.loginMessage}
        </h3>
      )}
      <div>
        <div className='mb-5'>
          <label
            htmlFor='username'
            className='block mb-2 text-md font-medium text-gray-900 dark:text-white'
          >
            username
          </label>
          <input
            type='text'
            id='username'
            className='border block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 rounded-md'
            placeholder='parcheesifan1'
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
      </div>
      <div>
        <div className='mb-5'>
          <label
            htmlFor='username'
            className='block mb-2 text-md font-medium text-gray-900'
          >
            password
          </label>
          <input
            type='password'
            id='password'
            className='border block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 rounded-md '
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
      </div>

      <div className='mb-2'>
        <input
          type='submit'
          name='submit'
          value='Log In'
          className='px-4 py-2 rounded-md border border-black  text-neutarl-700 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200'
        />
      </div>
    </form>
  );
}

export default LoginForm;
