import { useEditCoachMutation } from "../../features/user/backendApi"
import { handleShowAlert } from "../../utils/handleShowAlert"
import { AlertType, EditCoachModalProps } from "../../utils/types"
import { useDispatch, useSelector } from "react-redux"
import { getErrorInfo } from "../../utils/helper"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Modal } from "@mui/material"
import Loader from "../ui/Loader"
import Button from "../ui/Button"
import Input from "../ui/Input"
import { RootState } from "../../store"

const EditCoachSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
})

type EditCoachFormValues = z.infer<typeof EditCoachSchema>

export default function EditCoach({
  isOpen,
  onClose,
  currentName,
  currentEmail,
  coachId,
}: EditCoachModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<EditCoachFormValues>({
    resolver: zodResolver(EditCoachSchema),
    defaultValues: { name: currentName, email: currentEmail },
  })

  const cookies = useSelector((state: RootState) => state.cookies)
  const [editCoach, { isLoading }] = useEditCoachMutation()

  const dispatch = useDispatch()

  const onSubmit = async (data: EditCoachFormValues) => {
    try {
      if (!coachId) {
        throw new Error("Coach not found. Please provide a valid ID.")
      }

      const updatedCoach = await editCoach({
        jwt: cookies.jwt,
        id: coachId,
        body: { name: data.name, email: data.email },
      }).unwrap()

      handleShowAlert(dispatch, {
        type: AlertType.Success,
        message: "Coach was updated successfully",
      })
      reset({ name: updatedCoach.name })
      onClose()
    } catch (error) {
      const { message } = getErrorInfo(error)
      handleShowAlert(dispatch, {
        type: AlertType.Error,
        message,
      })
    }
  }

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-describedby="Edit coach details"
      component="div"
      className="flex items-center max-w-md mx-auto "
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-6 p-5 bg-white rounded-xl"
      >
        <h1 className="text-3xl font-semibold text-center">Edit coach</h1>
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

        <div className="flex justify-around gap-2">
          <Button outlined onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || !isDirty}>
            <span className="flex items-center gap-1">
              {isLoading && <Loader borderColor="#fff" size="xs" />}
              Save
            </span>
          </Button>
        </div>
      </form>
    </Modal>
  )
}
