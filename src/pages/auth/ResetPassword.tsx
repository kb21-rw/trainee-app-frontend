import React from "react"
import { Link } from "react-router-dom"
import { H1 } from "../../components/ui/Typography"
import Loader from "../../components/ui/Loader"
import InputField from "../../components/ui/InputField"
import Button from "../../components/ui/Button"
import { useForm } from "react-hook-form"
import { useResetPasswordMutation } from "../../features/user/backendApi"
import { AlertType, ButtonSize } from "../../utils/types"
import { getErrorInfo } from "../../utils/helper"
import { handleShowAlert } from "../../utils/handleShowAlert"
import { useDispatch } from "react-redux"

const ResetPassword = () => {
  const [resetPassword, { isLoading, error, isSuccess }] =
    useResetPasswordMutation()
  const dispatch = useDispatch()
  const { register, handleSubmit } = useForm()
  const onSubmit = async (data: any) => {
    await resetPassword({ email: data.email })
  }

  if (error) {
    const { message } = getErrorInfo(error)
    handleShowAlert(dispatch, {
      type: AlertType.Error,
      message,
    })
  }

  if (isSuccess) {
    handleShowAlert(dispatch, {
      type: AlertType.Success,
      message: "Password was reset successfully!",
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col h-screen justify-center gap-5 md:gap-16 items-center px-5 sm:px-10 md:p-0 max-w-xl mx-auto"
    >
      <H1>Reset password</H1>
      {isLoading && <Loader />}
      <div className="space-y-3 md:space-y-6 lg:space-y-10 w-full">
        <InputField
          name="email"
          type="email"
          label="Email address"
          placeholder="example@gmail.com"
          register={register}
          options={{
            required: { value: true, message: "Email is required field" },
          }}
        />
      </div>

      <Button size={ButtonSize.Large} type="submit">
        Reset
      </Button>
      <div className="">
        Back to{" "}
        <Link to="/auth" className="text-primary-dark">
          login ?
        </Link>
      </div>
    </form>
  )
}

export default ResetPassword
