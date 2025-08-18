import { useForm } from "react-hook-form"
import Button from "../ui/Button"
import { Modal } from "@mui/material"
import { AlertType, User, UserRow } from "../../utils/types"
import { useUpdateParticipantMutation } from "../../features/user/backendApi"
import { useDispatch, useSelector } from "react-redux"
import { getErrorInfo } from "../../utils/helper"
import { handleShowAlert } from "../../utils/handleShowAlert"
import Input from "../ui/Input"
import SmartSelect from "../ui/SmartSelect"
import Loader from "../ui/Loader"
import { RootState } from "../../store"

export default function EditParticipantModal({
  type,
  row,
  coaches,
  onClose,
}: {
  type: "applicant" | "trainee"
  row: UserRow
  coaches: User[]
  onClose: () => void
}) {
  const cookies = useSelector((state: RootState) => state.cookies)
  const {
    handleSubmit,
    register,
    formState: { errors, isDirty },
  } = useForm<{ name: string; coachId: string }>({
    defaultValues: { name: row.name ?? "", coachId: row.coach ?? "" },
  })
  const [updateParticipant, { error, isSuccess, isLoading }] =
    useUpdateParticipantMutation()
  const dispatch = useDispatch()

  const coachOptions = [
    { value: "", label: "No coach" },
    ...coaches
      .filter((coach) => coach.active)
      .map((coach) => ({
        value: coach._id,
        label: coach.name,
      })),
  ]

  const selectedCoach = coachOptions.find((coach) => coach.value === row?.coach)

  const onSubmit = async (formData: { name: string; coachId: string }) => {
    await updateParticipant({
      jwt: cookies.jwt,
      body: formData,
      participantId: row.traineeId,
    })
  }

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
      message: "Participant was updated successfully",
    })
    onClose()
  }

  return (
    <Modal
      open={Boolean(row.id)}
      onClose={onClose}
      aria-labelledby="Edit Participant"
      aria-describedby=""
      component="div"
      className="flex items-center max-w-md mx-auto "
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-6 p-5 bg-white rounded-xl"
      >
        <h1 className="text-3xl font-semibold text-center">Edit {type}</h1>
        <Input
          type="text"
          label="Name"
          register={{ ...register("name", { required: "Name is required" }) }}
          error={errors.name?.message}
        />
        <SmartSelect
          defaultValue={selectedCoach}
          options={coachOptions}
          register={{ ...register("coachId") }}
        />
        <div className="flex justify-around gap-2">
          <Button outlined onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit" disabled={!isDirty}>
            <span className="flex items-center gap-1">
              {isLoading && <Loader borderColor="#fff" size="xs" />}
              <span>Save</span>
            </span>
          </Button>
        </div>
      </form>
    </Modal>
  )
}
