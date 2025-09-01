import { useState } from "react"
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
    formState: { errors, isDirty },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      name: data?.name,
      email: data?.email,
      password: "",
    },
  })

  const onSubmit = async (submittedData: {
    email?: string
    name?: string
    password?: string
  }) => {
    if (!submittedData.password && submittedData.name === data.name) {
      handleShowAlert(dispatch, {
        type: AlertType.Success,
        message: "No changes were made!",
      })
      setOtherAlertMessage(true)
      return
    }

    //allow success or error message to be alerted if changes were made
    setOtherAlertMessage(false)

    const profileData: { email?: string; name?: string; password?: string } = {}

    if (submittedData.name) profileData.name = submittedData.name
    if (submittedData.password) profileData.password = submittedData.password

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

  return (
    <div className="flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-md p-10 space-y-8 bg-white rounded-xl custom-shadow">
        <div>
          <H1>Profile Settings</H1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {isLoading && <Loader />}
          {errors.password && (
            <div className="flex items-center justify-center py-2 rounded-lg bg-error-light text-error-dark">
              {String(errors.password?.message)}
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
              name="password"
              type="password"
              label="Password"
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
