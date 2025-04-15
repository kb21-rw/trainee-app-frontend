import { useForm } from "react-hook-form"
import Button from "../ui/Button"
import { Modal } from "@mui/material"
import {
  AlertType,
  ButtonVariant,
  Cookie,
  User,
  UserRole,
} from "../../utils/types"
import Input from "../ui/Input"
import Select from "../ui/Select"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { getErrorInfo } from "../../utils/helper"
import { handleShowAlert } from "../../utils/handleShowAlert"
import { useDispatch } from "react-redux"
import { useCookies } from "react-cookie"
import {
  useToggleUserActiveStatusMutation,
  useUpdateUserMutation,
} from "../../features/user/backendApi"
import Loader from "../ui/Loader"
import { useState, useEffect } from "react"

const selectOptions = [
  { value: UserRole.Prospect, label: "Prospect" },
  { value: UserRole.Coach, label: "Coach" },
  { value: UserRole.Trainee, label: "Trainee" },
  { value: UserRole.Applicant, label: "Applicant" },
  { value: UserRole.Admin, label: "Admin" },
]

const EditUserFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  role: z.enum([
    UserRole.Prospect,
    UserRole.Coach,
    UserRole.Admin,
    UserRole.Applicant,
    UserRole.Trainee,
  ]),
})

export default function EditUserModal({
  isOpen,
  defaultValues,
  onClose,
}: {
  isOpen: boolean
  defaultValues: User
  onClose: () => void
}) {
  const [cookies] = useCookies([Cookie.jwt])
  const dispatch = useDispatch()
  const [updateUser, { isLoading: isUserLoading, reset: resetUpdateUser }] =
    useUpdateUserMutation()
  const [toggleUserActive, { isLoading: isToggleLoading }] =
    useToggleUserActiveStatusMutation()
  const [showConfirmation, setShowConfirmation] = useState(false)

  const [isUserActive, setIsUserActive] = useState(
    defaultValues.active !== false,
  )

  useEffect(() => {
    setIsUserActive(defaultValues.active !== false)
  }, [defaultValues])

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors, isDirty },
  } = useForm<User>({
    resolver: zodResolver(EditUserFormSchema),
    defaultValues: {
      name: defaultValues.name,
      email: defaultValues.email,
      role: defaultValues.role,
      active: defaultValues.active,
    },
  })

  const onSubmit = async (formData: User) => {
    try {
      await updateUser({
        jwt: cookies.jwt,
        body: formData,
        id: defaultValues._id,
      }).unwrap()
      handleShowAlert(dispatch, {
        type: AlertType.Success,
        message: `User ${defaultValues.userId} was updated successfully.`,
      })
      resetForm()
      onClose()
    } catch (error) {
      const { message } = getErrorInfo(error)
      handleShowAlert(dispatch, {
        type: AlertType.Error,
        message,
      })
    } finally {
      resetUpdateUser()
    }
  }

  const handleToggleActive = async () => {
    try {
      await toggleUserActive({
        jwt: cookies.jwt,
        userId: defaultValues._id,
      }).unwrap()

      const action = isUserActive ? "deactivated" : "activated"
      handleShowAlert(dispatch, {
        type: AlertType.Success,
        message: `Admin ${defaultValues.name} was ${action} successfully.`,
      })
      setShowConfirmation(false)
      onClose()
    } catch (error) {
      const { message } = getErrorInfo(error)
      handleShowAlert(dispatch, {
        type: AlertType.Error,
        message,
      })
    }
  }

  const showActivateButton = defaultValues.role === UserRole.Admin
  const activationButtonText = isUserActive ? "Deactivate" : "Activate"

  return (
    <>
      {/* Edit Modal */}
      <Modal
        open={isOpen && !showConfirmation}
        onClose={onClose}
        aria-describedby="Add user"
        component="div"
        className="max-w-md mx-auto flex items-center"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 w-full bg-white p-5 rounded-xl"
        >
          <h1 className="text-center text-3xl font-semibold">Edit user</h1>
          <Input
            register={{ ...register("name") }}
            label="Name"
            error={errors.name?.message}
          />
          <Input
            register={{ ...register("email") }}
            label="Email"
            disabled
            error={errors.email?.message}
          />
          <Select
            options={selectOptions}
            label="Role"
            register={register("role")}
            error={errors.role?.message}
          />

          {showActivateButton && (
            <div className="mt-2">
              <Button
                onClick={() => setShowConfirmation(true)}
                className={`w-full ${isUserActive ? "bg-red-600 hover:bg-red-700" : ""}`}
              >
                {activationButtonText}
              </Button>
            </div>
          )}

          <div className="flex justify-around gap-2">
            <Button outlined onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit" disabled={isUserLoading || !isDirty}>
              <span className="flex items-center gap-1">
                {isUserLoading ? <Loader borderColor="#fff" size="xs" /> : ""}
                <span>Save</span>
              </span>
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        aria-describedby="Confirm deactivation"
        component="div"
        className="max-w-md mx-auto flex items-center"
      >
        <div className="flex flex-col gap-6 w-full bg-white p-5 rounded-xl">
          <h1 className="text-center text-2xl font-semibold">
            {isUserActive ? "Deactivate an Admin" : "Activate an Admin"}
          </h1>

          <p className="text-center">
            Confirm if you want to {isUserActive ? "deactivate" : "activate"} an
            Admin
          </p>

          <div className="flex justify-around gap-2">
            <Button outlined onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>

            <Button
              onClick={handleToggleActive}
              disabled={isToggleLoading}
              variant={
                isUserActive ? ButtonVariant.Danger : ButtonVariant.Primary
              }
            >
              <span className="flex items-center gap-1">
                {isToggleLoading ? <Loader borderColor="#fff" size="xs" /> : ""}
                <span>{isUserActive ? "Deactivate" : "Activate"}</span>
              </span>
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
