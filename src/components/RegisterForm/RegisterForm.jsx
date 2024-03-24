import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();

  const registerUser = (event) => {
    event.preventDefault();

    dispatch({
      type: "REGISTER",
      payload: {
        username: username,
        password: password,
      },
    });
  }; // end registerUser

  return (
    <form onSubmit={registerUser}>
      <h2 className='text-2xl font-light mb-3'>Register</h2>
      {errors.registrationMessage && (
        <h3 className='alert' role='alert'>
          {errors.registrationMessage}
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
          className='px-4 py-2 rounded-md border border-black  text-neutarl-700 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200'
          type='submit'
          name='submit'
          value='Register'
        />
      </div>
    </form>
  );
}

export default RegisterForm;
