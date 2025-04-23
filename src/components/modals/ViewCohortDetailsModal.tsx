import { Controller, useForm } from "react-hook-form"
import Button from "../ui/Button"
import { Modal } from "@mui/material"
import { Stage } from "../../utils/types"
import Input from "../ui/Input"
import dayjs from "dayjs"
import UpdateStages, { FormData } from "../ui/UpdateStages"
import { DatePicker } from "@mui/x-date-pickers"
import CloseIcon from "../../assets/CloseIcon"

interface ViewCohortDetailsModalProps {
  onClose: () => void
  cohort: {
    _id: string
    name: string
    description: string
    trainingStartDate: string
    stages: Stage[]
  }
}

export default function ViewCohortDetailsModal({
  onClose,
  cohort,
}: ViewCohortDetailsModalProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: cohort.name,
      description: cohort.description,
      trainingStartDate: dayjs(cohort.trainingStartDate),
      stages: cohort.stages,
    },
  })

  return (
    <Modal
      open={Boolean(cohort)}
      onClose={onClose}
      aria-describedby="View Cohort"
      className="max-w-md max-h-[80%] mx-auto my-auto flex items-center"
    >
      <form className="flex flex-col flex-1 max-h-full gap-6 p-5 overflow-y-scroll bg-white rounded-xl">
        <div className="flex self-end -mt-2 -mr-4">
          <Button onClick={onClose} outlined noBackground>
            <CloseIcon />
          </Button>
        </div>
        <h1 className="text-3xl font-semibold text-center">Cohort Details</h1>

        <Input register={register("name")} label="Name" disabled />

        <Input
          register={register("description")}
          label="Description"
          disabled
        />

        <Controller
          name="trainingStartDate"
          control={control}
          render={({ field }) => (
            <DatePicker
              value={field.value ?? null}
              label="Training Start Date"
              disabled
            />
          )}
        />

        <UpdateStages
          control={control}
          register={register}
          readOnly
          error={errors}
        />
      </form>
    </Modal>
  )
}
