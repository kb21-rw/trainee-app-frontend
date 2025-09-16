import { useEffect, useState } from "react"
import { H1 } from "../../components/ui/Typography"
import Button from "../../components/ui/Button"
import InputField from "../../components/ui/InputField"
import Loader from "../../components/ui/Loader"
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../../features/user/backendApi"
import { useForm } from "react-hook-form"
import { getErrorInfo } from "../../utils/helper"
import { handleShowAlert } from "../../utils/handleShowAlert"
import { AlertType } from "../../utils/types"
import { useDispatch } from "react-redux"

const Profile = () => {
  const [updateProfile, { isLoading, isSuccess, error }] =
    useUpdateProfileMutation()
  const [otherAlertMessage, setOtherAlertMessage] = useState(false)
  const dispatch = useDispatch()
  const { data } = useGetProfileQuery()
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty, isSubmitSuccessful },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      name: data?.name,
      email: data?.email,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  useEffect(() => {
    if (isSubmitSuccessful && !error?.status) {
      reset({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    }
  }, [reset, isSubmitSuccessful, error])

  const password = watch("newPassword")

  const onSubmit = async (submittedData: {
    email?: string
    name?: string
    oldPassword?: string
    newPassword?: string
    confirmPassword?: string
  }) => {
    if (!submittedData.newPassword && submittedData.name === data.name) {
      handleShowAlert(dispatch, {
        type: AlertType.Success,
        message: "No changes were made!",
      })
      setOtherAlertMessage(true)
      return
    }

    //allow success or error message to be alerted if changes were made
    setOtherAlertMessage(false)

    const profileData: {
      email?: string
      name?: string
      password?: string
      oldPassword?: string
    } = {}

    if (submittedData.name) profileData.name = submittedData.name
    if (submittedData.newPassword) {
      profileData.password = submittedData.newPassword
      profileData.oldPassword = submittedData.oldPassword
    }

    await updateProfile({ profileData })
  }

  if (error && !otherAlertMessage) {
    const { message } = getErrorInfo(error)
    handleShowAlert(dispatch, {
      type: AlertType.Error,
      message,
    })
  }

  if (isSuccess && !otherAlertMessage) {
    handleShowAlert(dispatch, {
      type: AlertType.Success,
      message: "Profile was updated successfully!",
    })
  }

  const errorMessage =
    errors.newPassword?.message ||
    errors.oldPassword?.message ||
    errors.confirmPassword?.message

  return (
    <div className="flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-md p-10 space-y-8 bg-white rounded-xl custom-shadow">
        <div>
          <H1>Profile Settings</H1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {isLoading && <Loader />}
          {errorMessage && (
            <div className="flex items-center justify-center p-2 rounded-lg bg-error-light text-error-dark">
              {String(errorMessage)}
            </div>
          )}
          <div className="space-y-3 rounded-md shadow-sm">
            <InputField
              name="name"
              type="text"
              label="Name"
              placeholder="Your Name"
              register={register}
            />
            <InputField
              name="email"
              type="email"
              label="Email"
              placeholder="your.email@example.com"
              disabled
              register={register}
            />
            <InputField
              name="oldPassword"
              type="password"
              label="Current Password"
              placeholder="Current Password"
              register={register}
              options={{
                validate: (value: string) => {
                  if (password && !value) {
                    return "Current password is required to set a new password"
                  }

                  if (value && password === value)
                    return "New password must be different from current password"

                  return true
                },
              }}
              errors={errors}
            />
            <InputField
              name="newPassword"
              type="password"
              label="New Password"
              placeholder="New Password"
              register={register}
              options={{
                pattern: {
                  required: false,
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    "Password must be 8+ characters with uppercase, lowercase, number, and special character.",
                },
              }}
              errors={errors}
            />
            <InputField
              name="confirmPassword"
              type="password"
              label="Confirm New Password"
              placeholder="Re-enter password"
              register={register}
              options={{
                validate: (value: string) => {
                  return value === password || "New passwords do not match"
                },
              }}
              errors={errors}
            />
          </div>
          <div>
            <Button type="submit" disabled={!isDirty}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile
