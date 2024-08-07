import React from 'react';
import { FaGithub } from "react-icons/fa";

const Login = ({ login }) => {
  return (
    <section className="min-h-screen px-5 lg:px-0 flex items-center">
      <div className="w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10 text-center">
        <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
          Hello! <span className="text-primaryColor">Welcome</span> to Project Maker
        </h3>

        <div className="mt-7">
          <button
            type="submit"
            className="w-full bg-primaryColor text-black text-[18px] leading-[30px] rounded-lg border border-black flex items-center justify-center space-x-2"
            onClick={login}
          >
            <FaGithub className="mr-2" />
            <span>Login with GitHub</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Login;
