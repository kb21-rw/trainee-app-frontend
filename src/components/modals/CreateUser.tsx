import { zodResolver } from "@hookform/resolvers/zod"
import { Modal } from "@mui/material"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { z } from "zod"
import {
  useCreateCoachMutation,
  useCreateUserMutation,
} from "../../features/user/backendApi"
import { handleShowAlert } from "../../utils/handleShowAlert"
import { getErrorInfo } from "../../utils/helper"
import { AlertType, CreateUserDto, UserRole } from "../../utils/types"
import Button from "../ui/Button"
import Input from "../ui/Input"
import Loader from "../ui/Loader"
import Select from "../ui/Select"

const selectOptions = [
  // Label here is prospect instead of trainee because a trainee represent many different statuses with Prospect being one of them.
  { value: UserRole.Trainee, label: "Prospect" },
  { value: UserRole.Coach, label: "Coach" },
  { value: UserRole.Admin, label: "Admin" },
]

const AddUserFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  role: z.enum([UserRole.Trainee, UserRole.Coach, UserRole.Admin]),
})

export default function CreateUser({
  isOpen,
  onClose,
  refetch,
}: {
  isOpen: boolean
  onClose: () => void
  refetch: () => void
}) {
  const dispatch = useDispatch()
  const [createUser, { isLoading: isUserLoading, reset: resetCreateUser }] =
    useCreateUserMutation()

  const [createCoach, { isLoading: isCoachLoading, reset: resetCreateCoach }] =
    useCreateCoachMutation()

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<CreateUserDto>({
    resolver: zodResolver(AddUserFormSchema),
    defaultValues: { name: "", email: "", role: UserRole.Trainee },
  })

  const onSubmit = async (formData: CreateUserDto) => {
    try {
      if (formData.role === UserRole.Coach) {
        await createCoach({ body: formData }).unwrap()
        handleShowAlert(dispatch, {
          type: AlertType.Success,
          message: "Coach was created successfully",
        })
        // Here we are refetching only after a user is created not in other cases like when the admin just cancels the modal.
        refetch()
      }

      if (
        [UserRole.Trainee, UserRole.Admin].includes(formData.role as UserRole)
      ) {
        await createUser({ body: formData }).unwrap()
        handleShowAlert(dispatch, {
          type: AlertType.Success,
          message: "User was created successfully",
        })
        refetch()
      }
    } catch (error) {
      const { message } = getErrorInfo(error)
      handleShowAlert(dispatch, {
        type: AlertType.Error,
        message,
      })
    } finally {
      resetForm()
      onClose()
      resetCreateUser()
      resetCreateCoach()
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
        <h1 className="text-center text-3xl font-semibold">Create user</h1>
        <Input
          register={{ ...register("name") }}
          label="Name"
          error={errors.name?.message}
        />
        <Input
          register={{ ...register("email") }}
          label="Email"
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

          <Button type="submit" disabled={isUserLoading || isCoachLoading}>
            <span className="flex items-center gap-1">
              {isUserLoading || isCoachLoading ? (
                <Loader borderColor="#fff" size="xs" />
              ) : (
                ""
              )}
              <span>Create User</span>
            </span>
          </Button>
        </div>
      </form>
    </Modal>
  )
}
