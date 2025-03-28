import { useForm } from "react-hook-form"
import Button from "../ui/Button"
import { Modal } from "@mui/material"
import { AlertType, Cookie, User, UserRole } from "../../utils/types"
import Input from "../ui/Input"
import Select from "../ui/Select"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { getErrorInfo } from "../../utils/helper"
import { handleShowAlert } from "../../utils/handleShowAlert"
import { useDispatch } from "react-redux"
import { useCookies } from "react-cookie"
import { useUpdateUserMutation } from "../../features/user/backendApi"
import Loader from "../ui/Loader"

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
  role: z.enum([UserRole.Prospect, UserRole.Coach, UserRole.Admin, UserRole.Applicant, UserRole.Trainee]),
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

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors, isDirty },
  } = useForm<User>({
    resolver: zodResolver(EditUserFormSchema),
    defaultValues: { name: defaultValues.name, email: defaultValues.email, role: defaultValues.role },
  })

  const onSubmit = async (formData: User) => {
    try {
      await updateUser({ jwt: cookies.jwt, body: formData, id: defaultValues._id }).unwrap()
      handleShowAlert(dispatch, {
        type: AlertType.Success,
        message: `The ${defaultValues.role} was updated successfully.`,
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


  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-describedby="Add user"
      component="div"
      className="max-w-md mx-auto flex items-center "
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

        <div className="flex justify-around gap-2">
          <Button outlined onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit" disabled={isUserLoading || !isDirty}>
            <span className="flex items-center gap-1">
              {isUserLoading ? <Loader borderColor="#fff" size="xs" /> : ""}
              <span>Save </span>
            </span>
          </Button>
        </div>
      </form>
    </Modal>
  )
}
