import { useState } from "react";
import ApplicantSignup from "../Applicant/ApplicantSignup";
import Login from "../User/Login";
import { H1 } from "../../components/ui/Typography";

const LoginSignup = () => {
  const [moveProgress, setMoveProgress] = useState(100);

  const togglePosition = () => {
    setMoveProgress(moveProgress === 0 ? 100 : 0);
  };

  return (
    <div className="flex relative">
      <div
        className={`absolute bg-primary-dark text-white w-1/2 h-screen z-40 flex flex-col items-center justify-center transition-transform duration-[800ms] ease-in-out`}
        style={{ transform: `translateX(${moveProgress}%)` }}
      >
        <div className="flex">
          {moveProgress === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-10">
              <div className="flex flex-col items-center justify-center">
                <H1>Welcome to</H1>
                <H1>The Gym Trainee Portal</H1>
              </div>

              <h4 className="text-2xl font-light">
                {"Already have an account?"}
              </h4>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-10">
              <div className="flex flex-col items-center justify-center">
                <H1>Welcome Back to</H1>
                <H1>The Gym Trainee Portal</H1>
              </div>
              <h4 className="text-2xl font-light">
                {"Don't have an  account yet?"}
              </h4>
            </div>
          )}
        </div>
        <div className="w-1/2 px-8">
          <button
            className="border-2 border-white w-full py-4 rounded-md mt-3 text-xl"
            onClick={togglePosition}
          >
            {moveProgress === 0 ? "Login" : "Signup"}
          </button>
        </div>
      </div>
      <Login />
      <ApplicantSignup />
    </div>
  );
};

export default LoginSignup;
