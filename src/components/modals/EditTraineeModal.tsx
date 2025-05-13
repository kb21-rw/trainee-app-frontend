/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form"
import { Modal } from "@mui/material"
import Button from "../ui/Button"
import Input from "../ui/Input"
import SmartSelect from "../ui/SmartSelect"
import { AlertType, Cookie, User, UserRow } from "../../utils/types"
import { useEditTraineeMutation } from "../../features/user/backendApi"
import { useCookies } from "react-cookie"
import Loader from "../ui/Loader"
import { handleShowAlert } from "../../utils/handleShowAlert"
import { getErrorInfo } from "../../utils/helper"
import { useDispatch } from "react-redux"

interface EditTraineeModalProps {
  row: UserRow
  coaches: User[]
  cohortId?: string
  onClose: () => void
}

export default function EditTraineeModal({
  row,
  coaches,
  onClose,
}: EditTraineeModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: row.name ?? "",
      email: row.email ?? "",
      coach: row.coach ?? "",
    },
  })
  console.log("my row:", row.id)
  const [cookies] = useCookies([Cookie.jwt])

  const coachOptions = [
    { value: "", label: "No coach" },
    ...coaches.map((coach) => ({
      value: coach._id,
      label: coach.name,
    })),
  ]

  const selectedCoach = coachOptions.find((coach) => coach.value === row?.coach)

  const [updateTrainee, { error, loading, isSuccess }] =
    useEditTraineeMutation()
  console.log("loading data", loading, "error occured", error)
  const dispatch = useDispatch()

  const onSubmit = async (data: { name: string; coach: string }) => {
    await updateTrainee({
      jwt: cookies.jwt,
      traineeId: row.id,
      name: data.name,
      coachId: data.coach,
    })
    onClose()
  }

  console.log("Updating trainee with ID:", row.id)

  if (error) {
    const { message } = getErrorInfo(error)
    handleShowAlert(dispatch, {
      type: AlertType.Error,
      message,
    })
    onClose()
  }

  if (isSuccess) {
    handleShowAlert(dispatch, {
      type: AlertType.Success,
      message: "Trainee was updated successfully",
    })
    onClose()
  }

  return (
    <Modal
      open={Boolean(row.id)}
      onClose={() => onClose()}
      aria-labelledby="Edit Trainee"
      className="flex items-center justify-center"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full max-w-md gap-6 p-6 bg-white rounded-xl"
      >
        <h1 className="text-2xl font-semibold text-center">Edit Trainee</h1>

        <Input
          type="text"
          label="Name"
          register={{
            ...register("name", { required: "Name is required" }),
          }}
          error={errors.name?.message}
        />

        <SmartSelect
          defaultValue={selectedCoach}
          options={coachOptions}
          register={{ ...register("coach") }}
        />

        <div className="flex justify-around gap-2">
          <Button type="button" outlined onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit" disabled={!isDirty}>
            <span className="flex items-center gap-1">
              {loading && <Loader borderColor="#fff" size="xs" />}
              <span>Confirm</span>
            </span>
          </Button>
        </div>
      </form>
    </Modal>
  )
}
