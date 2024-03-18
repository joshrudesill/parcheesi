import React from "react";
import LoginForm from "../LoginForm/LoginForm";
import { useHistory } from "react-router-dom";

function LoginPage() {
  const history = useHistory();

  return (
    <div className='flex justify-center pt-24 '>
      <div className='flex flex-col w-[30%]'>
        <LoginForm />

        <div>
          <button
            type='button'
            className='px-4 py-2 rounded-md border border-black  text-neutarl-700 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200'
            onClick={() => {
              history.push("/registration");
            }}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
