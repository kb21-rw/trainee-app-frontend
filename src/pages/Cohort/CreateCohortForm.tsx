import { InputLabel, Stack } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import Button from "../../components/ui/Button"
import { ButtonSize, Cookie } from "../../utils/types"
import CohortTextField from "./CohortTextField"
import Stages from "./Stages"
import { z } from "zod"
import { Controller, useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import dayjs, { Dayjs } from "dayjs"
import { useCookies } from "react-cookie"

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  trainingStartDate: z
    .custom((value) => dayjs.isDayjs(value) || value instanceof Date, {
      message: "Training start date is required",
    })
    .transform((value) => (dayjs.isDayjs(value) ? value.toDate() : value)),
  stages: z
    .array(
      z.object({
        stageName: z.string().min(2, "Stage Name is required"),
        stageDescription: z.string().min(2, "Stage Description is required"),
      }),
    )
    .nonempty("At least one stage is required"),
})

const FORM_NAME = {
  name: "name",
  description: "description",
  trainingStartDate: "trainingStartDate",
  stages: { stageName: "stageName", stageDescription: "stageDescription" },
} as const

type TCohortFormValues = {
  name: string
  description: string
  trainingStartDate: Dayjs | null
  stages: { stageName: string; stageDescription: string }[]
}

function CreateCohortForm({
  handleClose,
  createCohort,
}: {
  handleClose: () => void
  // eslint-disable-next-line no-unused-vars
  createCohort: (_data: { jwt: string; body: any }) => any
}) {
  const [cookies] = useCookies([Cookie.jwt])
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      trainingStartDate: null,
      stages: [{ stageName: "", stageDescription: "" }],
    },
  })

  const onSubmit: SubmitHandler<TCohortFormValues> = async (data) => {
    await createCohort({
      jwt: cookies.jwt,
      body: {
        ...data,
        stages: data.stages.map((stage) => {
          return {
            name: stage.stageName,
            description: stage.stageDescription,
          }
        }),
      },
    })
    handleClose()
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(async (formData) => {
        try {
          await onSubmit(formData)
          reset()
        } catch (error) {
          reset(formData)
        }
      })}
    >
      <CohortTextField
        name={FORM_NAME.name}
        control={control}
        register={register}
        errors={errors}
        label="Names"
      />
      <CohortTextField
        name={FORM_NAME.description}
        control={control}
        register={register}
        errors={errors}
        label="Description"
      />
      <InputLabel shrink htmlFor="bootstrap-input">
        Training start date
      </InputLabel>
      <Controller
        control={control}
        name={FORM_NAME.trainingStartDate}
        render={({ field: { onChange, value } }) => {
          return (
            <DatePicker
              minDate={dayjs().add(1, "day")}
              value={value || null}
              onChange={(newValue: Dayjs | null) => {
                onChange(newValue)
              }}
              disablePast
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                  helperText: errors[FORM_NAME.trainingStartDate]?.message,
                  error: FORM_NAME.trainingStartDate in errors,
                },
              }}
            />
          )
        }}
      />

      <Stages
        stagesNames={FORM_NAME.stages}
        control={control}
        register={register}
        errors={errors}
      />
      <Stack
        paddingBlock={5}
        paddingInline={17}
        justifyItems="center"
        justifyContent="center"
      >
        <Button type="submit" size={ButtonSize.Small}>
          Submit
        </Button>
      </Stack>
    </form>
  )
}

export default CreateCohortForm
