import {
  useGoogleAuthMutation,
  useSignupMutation,
} from "../../features/user/backendApi"
import { useForm } from "react-hook-form"
import { useNavigate, useSearchParams } from "react-router-dom"
import InputField from "../../components/ui/InputField"
import Button from "../../components/ui/Button"
import { H1 } from "../../components/ui/Typography"
import Loader from "../../components/ui/Loader"
import { AlertType, ButtonSize } from "../../utils/types"
import { CredentialResponse, GoogleLogin } from "@react-oauth/google"
import { getErrorInfo } from "../../utils/helper"
import { handleShowAlert } from "../../utils/handleShowAlert"
import { useDispatch } from "react-redux"
import { setToken } from "../../features/user/authSlice"

const Signup = ({ handlePageChange }: { handlePageChange: () => void }) => {
  const [signup, { isLoading, error }] = useSignupMutation()
  const dispatch = useDispatch()
  const [handleAuthWithGoogle] = useGoogleAuthMutation()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectUrl = searchParams.get("redirectTo")

  const password = watch("password")

  const saveTokenAndRedirect = (token: string) => {
    dispatch(setToken({ jwt: token }))

    navigate(
      redirectUrl ?? "/",
      redirectUrl ? {} : { state: { redirect: "home" } },
    )
  }

  const onSubmit = async (userData: any) => {
    const result = await signup({
      name: userData.name,
      email: userData.email,
      password: userData.password,
    })

    if (result.data.userId) {
      return navigate("/signup/thank-you")
    }

    return undefined
  }

  const errorMessage: any =
    errors.email?.message ||
    errors.password?.message ||
    errors["confirm-password"]?.message ||
    error?.data?.errorMessage

  const handleGoogleAuth = async (credentialResponse: CredentialResponse) => {
    try {
      const result = await handleAuthWithGoogle({
        token: credentialResponse.credential,
      })
      if (result.error) {
        throw result.error
      }

      saveTokenAndRedirect(result?.data?.accessToken)
    } catch (error) {
      const { message } = getErrorInfo(error)
      handleShowAlert(dispatch, { type: AlertType.Error, message })
    }
  }

  const handleGoogleAuthFailure = () => {
    handleShowAlert(dispatch, {
      type: AlertType.Error,
      message: "Sign up with Google Failed",
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center h-screen gap-5 px-5 mx-auto md:gap-8 sm:px-10 md:p-0 md:max-w-sm"
    >
      <div className="text-center">
        <H1>Signup</H1>
      </div>
      <div className="flex justify-center w-full text-center">
        {isLoading && <Loader />}
      </div>
      <div className="space-y-3 md:space-y-6 lg:space-y-7">
        {errorMessage && (
          <div className="flex items-center justify-center py-2 rounded-lg bg-error-light text-error-dark">
            {errorMessage}
          </div>
        )}
        <div className="flex flex-col gap-5">
          <InputField
            name="name"
            type="text"
            label="Name"
            placeholder="Your name"
            register={register}
            options={{
              required: { value: true, message: "Name is a required field" },
            }}
            errors={errors}
          />
          <InputField
            name="email"
            type="email"
            label="Email address"
            placeholder="example@gmail.com"
            register={register}
            options={{
              required: { value: true, message: "Email is a required field" },
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              }, // checks if the email follows the standard format.
            }}
            errors={errors}
          />
          <InputField
            name="password"
            type="password"
            label="Password"
            placeholder="password"
            register={register}
            options={{
              required: {
                value: true,
                message: "Password is a required field",
              },
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  "Password must be 8+ characters with uppercase, lowercase, number, and special character.",
              }, // checks if password is valid
            }}
            errors={errors}
          />
          <InputField
            name="confirm-password"
            type="password"
            label="Confirm Password"
            placeholder="Re-enter password"
            register={register}
            options={{
              required: {
                value: true,
                message: "Password confirmation is a required field",
              },
              validate: (value: string) =>
                value === password || "Passwords do not match",
            }}
            errors={errors}
          />
        </div>
      </div>
      <div className="flex flex-col items-center w-full gap-3">
        <Button size={ButtonSize.Large} type="submit">
          Sign Up
        </Button>
        <GoogleLogin
          text="continue_with"
          onSuccess={handleGoogleAuth}
          onError={handleGoogleAuthFailure}
        />
      </div>
      <div className="w-full md:hidden">
        <Button size={ButtonSize.Large} onClick={handlePageChange} outlined>
          I already have an account
        </Button>
      </div>
    </form>
  )
}

export default Signup
