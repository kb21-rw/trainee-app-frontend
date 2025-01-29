import { Controller, useForm } from "react-hook-form"
import Button from "../ui/Button"
import { Modal } from "@mui/material"
import { AlertType, Cookie, Stage } from "../../utils/types"
import Input from "../ui/Input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { getErrorInfo } from "../../utils/helper"
import { handleShowAlert } from "../../utils/handleShowAlert"
import { useDispatch } from "react-redux"
import { useCookies } from "react-cookie"
import { useUpdateCohortMutation } from "../../features/user/backendApi"
import Loader from "../ui/Loader"
import dayjs from "dayjs"
import UpdateStages from "../ui/UpdateStages"
import { DatePicker } from "@mui/x-date-pickers"

const updateCohortForm = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  trainingStartDate: z.custom(
    (value) =>
      value === undefined || dayjs.isDayjs(value) || value instanceof Date,
    {
      message: "End date is required",
    },
  ),
  stages: z.array(
    z.object({
      name: z.string().min(2, "Name is required"),
      description: z.string(),
    }),
  ),
})

type UpdateCohortFormSchema = z.infer<typeof updateCohortForm>

interface UpdateCohortModalProps {
  onClose: () => void
  cohort: {
    _id: string
    name: string
    description: string
    trainingStartDate: string
    stages: Stage[]
  }
}

export default function UpdateCohortModal({
  onClose,
  cohort,
}: UpdateCohortModalProps) {
  const [cookies] = useCookies([Cookie.jwt])
  const dispatch = useDispatch()
  const [
    updateCohort,
    {
      error: cohortError,
      isLoading: isCohortLoading,
      reset: resetUpdateCohort,
    },
  ] = useUpdateCohortMutation()

  const {
    register,
    control,
    handleSubmit,
    reset: resetForm,
    formState: { errors, dirtyFields },
  } = useForm<UpdateCohortFormSchema>({
    resolver: zodResolver(updateCohortForm),
    defaultValues: {
      name: cohort?.name ?? "",
      description: cohort?.description ?? "",
      trainingStartDate: dayjs(cohort?.trainingStartDate),
      stages: cohort?.stages ?? [],
    },
  })

  const onSubmit = async (formData: UpdateCohortFormSchema) => {
    const requestBody: Partial<UpdateCohortFormSchema> = {}

    for (const key in dirtyFields) {
      const myKey = key as keyof UpdateCohortFormSchema
      if (!dirtyFields[myKey]) continue
      requestBody[myKey] = formData[myKey] as any
    }

    try {
      await updateCohort({
        jwt: cookies.jwt,
        body: requestBody,
        id: cohort._id,
      })
      handleShowAlert(dispatch, {
        type: AlertType.Success,
        message: "Cohort was updated successfully",
      })
      resetForm()
      onClose()
    } catch (error) {
      const { message } = getErrorInfo(cohortError)
      handleShowAlert(dispatch, {
        type: AlertType.Error,
        message,
      })
    } finally {
      resetUpdateCohort()
    }
  }

  const handleCloseModal = () => {
    resetForm()
    onClose()
  }

  return (
    <Modal
      open={Boolean(cohort)}
      onClose={handleCloseModal}
      aria-describedby="Add user"
      component="div"
      className="max-w-md max-h-[80%] mx-auto my-auto flex items-center"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 flex flex-col gap-6 max-h-full overflow-y-scroll bg-white p-5 rounded-xl"
      >
        <h1 className="text-center text-3xl font-semibold">Update cohort</h1>
        <Input
          register={{ ...register("name") }}
          label="Name"
          error={errors.name?.message}
        />
        <Input
          register={{ ...register("description") }}
          label="Description"
          error={errors.description?.message}
        />
        <Controller
          name="trainingStartDate"
          control={control}
          render={({ field, ...props }) => (
            <DatePicker
              value={field.value ?? null}
              onChange={field.onChange}
              label="Training start date"
              {...props}
            />
          )}
        />
        <UpdateStages control={control} register={register} error={errors} />

        <div className="flex justify-around gap-2">
          <Button outlined onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit" disabled={isCohortLoading}>
            <span className="flex items-center gap-1">
              {isCohortLoading ? <Loader borderColor="#fff" size="xs" /> : ""}
              <span>Update</span>
            </span>
          </Button>
        </div>
      </form>
    </Modal>
  )
}
