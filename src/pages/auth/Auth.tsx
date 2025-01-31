import { useState } from "react"
import ApplicantSignup from "./Signup"
import Login from "./Login"
import { AuthPage } from "../../utils/types"
import classNames from "classnames"

const Auth = () => {
  const [page, setPage] = useState<AuthPage>(AuthPage.Login)

  const handlePageChange = () => {
    setPage((prevPage) =>
      prevPage === AuthPage.Login ? AuthPage.Signup : AuthPage.Login,
    )
  }

  return (
    <div className="flex relative">
      <div
        className={classNames(
          "hidden absolute bg-primary-dark text-white w-1/2 h-screen z-40 md:flex flex-col items-center justify-center transition-transform duration-[800ms] ease-in-out",
          { "translate-x-full": page === AuthPage.Login },
          { "translate-x-0": page === AuthPage.Signup },
        )}
      >
        <div className="space-y-10 text-center">
          {page === AuthPage.Login && (
            <>
              <h1 className="text-4xl font-bold leading-snug">
                Welcome back to <br /> The Gym trainee portal
              </h1>
              <h4 className="text-2xl font-light">
                Don&apos;t have an account yet?
              </h4>
            </>
          )}
          {page === AuthPage.Signup && (
            <>
              <h1 className="text-4xl font-bold text-center leading-snug">
                Welcome to <br /> The Gym Trainee Portal
              </h1>
              <h4 className="text-2xl font-light">Already have an account?</h4>
            </>
          )}
        </div>
        <div className="w-1/2 px-8">
          <button
            className="border-2 border-white w-full py-4 rounded-md mt-3 text-xl"
            onClick={handlePageChange}
          >
            {page === AuthPage.Login ? AuthPage.Signup : AuthPage.Login}
          </button>
        </div>
      </div>
      <div
        className={classNames("flex-1 px-4", {
          "hidden md:block": page === AuthPage.Signup,
        })}
      >
        <Login handlePageChange={handlePageChange} />
      </div>
      <div
        className={classNames("flex-1 px-4", {
          "hidden md:block": page === AuthPage.Login,
        })}
      >
        <ApplicantSignup handlePageChange={handlePageChange} />
      </div>
    </div>
  )
}

export default Auth
