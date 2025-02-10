import { Link, useNavigate, useSearchParams } from "react-router-dom"
import {
  useGoogleAuthMutation,
  useLoginMutation,
} from "../../features/user/backendApi"
import { useForm, SubmitHandler } from "react-hook-form"
import { H1 } from "../../components/ui/Typography"
import Button from "../../components/ui/Button"
import InputField from "../../components/ui/InputField"
import Loader from "../../components/ui/Loader"
import { AlertType, ButtonSize, Cookie } from "../../utils/types"
import { useDispatch } from "react-redux"
import { getErrorInfo } from "../../utils/helper"
import { handleShowAlert } from "../../utils/handleShowAlert"
import { useCookies } from "react-cookie"
import { CredentialResponse, GoogleLogin } from "@react-oauth/google"

interface LoginForm {
  email: string
  password: string
}

const Login = ({ handlePageChange }: { handlePageChange: () => void }) => {
  const [, setCookie] = useCookies([Cookie.jwt])
  const dispatch = useDispatch()
  const [handleLogin, { loginIsLoading, error: loginError }] =
    useLoginMutation()
  const [handleAuthWithGoogle, { googleAuthIsLoading }] =
    useGoogleAuthMutation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectUrl = searchParams.get("redirectTo")

  const saveTokenAndRedirect = (token: string) => {
    setCookie(Cookie.jwt, token)

    navigate(
      redirectUrl ?? "/applicants", // if there's no redirectUrl, navigating to any protected route will redirect to the homepage
      redirectUrl ? {} : { state: { redirect: "home" } },
    )
  }

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    try {
      const result = await handleLogin(data)

      if (result.error) {
        throw result.error
      }

      saveTokenAndRedirect(result?.data?.accessToken)
    } catch (error) {
      const { message } = getErrorInfo(error)
      handleShowAlert(dispatch, { type: AlertType.Error, message })
    }
  }

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
      message: "Login with Google Failed",
    })
  }

  if (loginError) {
    const { message } = getErrorInfo(loginError)
    handleShowAlert(dispatch, { type: AlertType.Error, message })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col h-screen items-center justify-center gap-5 md:gap-16  px-5 sm:px-10 md:p-0 mx-auto md:max-w-sm"
    >
      <div className="text-center">
        <H1>Login</H1>
      </div>
      <div className="space-y-3 md:space-y-6 lg:space-y-10 w-full">
        {(loginIsLoading || googleAuthIsLoading) && (
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        )}

        <InputField
          name="email"
          type="email"
          label="Email address"
          placeholder="example@gmail.com"
          register={register}
          options={{
            required: { value: true, message: "Email is required field" },
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
            required: { value: true, message: "Password is required field" },
          }}
          errors={errors}
        />
      </div>
      <div className="flex flex-col items-center gap-3 w-full">
        <Button size={ButtonSize.Large} type="submit">
          Login
        </Button>
        <GoogleLogin
          text="continue_with"
          onSuccess={handleGoogleAuth}
          onError={handleGoogleAuthFailure}
        />
      </div>

      <div className="w-full">
        <span>
          Forgot password?{" "}
          <Link to="/reset-password" className="text-primary-dark">
            Reset
          </Link>
        </span>
      </div>
      <div className="w-full md:hidden  mb-6">
        <Button size={ButtonSize.Large} outlined onClick={handlePageChange}>
          I Don&apos;t have an account
        </Button>
      </div>
    </form>
  )
}

export default Login
