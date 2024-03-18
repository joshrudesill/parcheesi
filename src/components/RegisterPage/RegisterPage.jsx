import React from "react";

import { useHistory } from "react-router-dom";
import RegisterForm from "../RegisterForm/RegisterForm";

function RegisterPage() {
  const history = useHistory();

  return (
    <div className='flex justify-center mt-24 '>
      <div className='flex flex-col w-[30%]'>
        <RegisterForm />

        <div>
          <button
            type='button'
            className='px-4 py-2 rounded-md border border-black  text-neutarl-700 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200'
            onClick={() => {
              history.push("/login");
            }}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
