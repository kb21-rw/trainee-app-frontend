import CheckMark from "../../assets/CheckMarkIcon"
import AddIcon from "../../assets/AddIcon"
import { Controller, useForm } from "react-hook-form"
import {
  useCreateQuestionMutation,
  useDeleteFormMutation,
  useEditFormMutation,
} from "../../features/user/backendApi"
import SuccessCheckMark from "../../assets/SuccessCheckMarkIcon"
import Delete from "../../assets/DeleteIcon"
import Loader from "./Loader"
import { useNavigate } from "react-router-dom"
import {
  AlertType,
  ApplicationForm,
  Cookie,
  Form,
  FormType,
  QuestionType,
} from "../../utils/types"
import { useCookies } from "react-cookie"
import classNames from "classnames"
import dayjs from "dayjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dispatch, SetStateAction } from "react"
import UpdateStages from "./UpdateStages"
import { DatePicker } from "@mui/x-date-pickers"
import { getErrorInfo } from "../../utils/helper"
import { handleShowAlert } from "../../utils/handleShowAlert"
import { useDispatch } from "react-redux"

const FormDto = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  startDate: z
    .custom((value) => dayjs.isDayjs(value) || value instanceof Date, {
      message: "Start date is required",
    })
    .transform((value) => (dayjs.isDayjs(value) ? value.toDate() : value)),
  endDate: z
    .custom((value) => dayjs.isDayjs(value) || value instanceof Date, {
      message: "End date is required",
    })
    .transform((value) => (dayjs.isDayjs(value) ? value.toDate() : value)),
  stages: z
    .array(
      z.object({
        name: z.string().min(2, "Name is required"),
        description: z.string(),
      }),
    )
    .optional(),
})

export type FormDtoSchema = z.infer<typeof FormDto>

interface UpdateFormProps {
  form: ApplicationForm | Form
  activeQuestion: string
  setActiveQuestion: Dispatch<SetStateAction<string>>
}

export default function EditableFormCard({
  form,
  activeQuestion,
  setActiveQuestion,
}: UpdateFormProps) {
  const defaultValues = {
    name: form.name,
    description: form.description ?? "",
    startDate:
      form.type === FormType.Application ? dayjs(form.startDate) : null,
    endDate: form.type === FormType.Application ? dayjs(form.endDate) : null,
    stages: form.type === FormType.Application ? form.stages : [],
  }
  const [cookies] = useCookies([Cookie.jwt])
  const dispatch = useDispatch()
  const {
    control,
    register,
    handleSubmit,
    formState: { isDirty, dirtyFields, errors },
  } = useForm<FormDtoSchema>({
    resolver: zodResolver(FormDto),
    defaultValues,
  })

  const [editForm] = useEditFormMutation()
  const [createQuestion] = useCreateQuestionMutation()
  const navigate = useNavigate()

  const [deleteForm, { isLoading: isDeleteFormLoading }] =
    useDeleteFormMutation()
  const handleDeleteForm = async () => {
    await deleteForm({ jwt: cookies.jwt, _id: form._id })
    navigate(`/forms`)
  }

  const onSubmit = async (data: FormDtoSchema) => {
    const requestBody: Partial<FormDtoSchema> = {}

    for (const key in dirtyFields) {
      const myKey = key as keyof FormDtoSchema
      if (!dirtyFields[myKey]) continue
      requestBody[myKey] = data[myKey] as any
    }

    try {
      const result = await editForm({
        jwt: cookies.jwt,
        id: form._id,
        body: { ...requestBody, type: form.type },
      })

      if (result.error) {
        throw result.error
      }

      navigate(`/forms/${result?.data?._id}`)
    } catch (error) {
      const { message } = getErrorInfo(error)
      handleShowAlert(dispatch, {
        type: AlertType.Error,
        message,
      })
    }
  }

  const handleAddQuestion = async () => {
    await createQuestion({
      jwt: cookies.jwt,
      formId: form._id,
      body: { prompt: `Question`, type: QuestionType.Text },
    })
  }

  return (
    <form
      className="flex gap-2"
      onFocus={() => setActiveQuestion("title")}
      onSubmit={handleSubmit(onSubmit)}
    >
      {isDeleteFormLoading && (
        <div className="absolute inset-0 h-full w-full">
          <Loader />
        </div>
      )}
      <div
        className={classNames(
          "p-8 custom-shadow border-primary-dark border-t-8  rounded-xl flex flex-col gap-8 flex-1",
          { "border-l-8 border-l-primary-light": activeQuestion === "prompt" },
        )}
      >
        <input
          placeholder="Enter title"
          className="outline-none text-[42px] font-bold border-b border-black/10"
          {...register("name")}
        />
        <input
          placeholder="Enter description"
          className="outline-none border-b border-black/10"
          {...register("description")}
        />
        {form.type === FormType.Application && (
          <>
            <div className="flex justify-between">
              <Controller
                name="startDate"
                control={control}
                render={({ field, ...props }) => (
                  <DatePicker
                    value={field.value ?? null}
                    onChange={field.onChange}
                    label="Application open date"
                    {...props}
                  />
                )}
              />
              <Controller
                name="endDate"
                control={control}
                render={({ field, ...props }) => (
                  <DatePicker
                    value={field.value ?? null}
                    onChange={field.onChange}
                    label="Application close date"
                    {...props}
                  />
                )}
              />
            </div>
            <UpdateStages
              control={control}
              register={register}
              error={errors}
            />
          </>
        )}
      </div>
      <div className="flex flex-col justify-between gap-6 p-4 custom-shadow rounded-xl">
        {isDirty ? (
          <button type="submit">
            <SuccessCheckMark />
          </button>
        ) : (
          <CheckMark />
        )}
        <button type="button" onClick={handleAddQuestion}>
          <AddIcon />
        </button>
        <button type="button" onClick={handleDeleteForm}>
          <Delete />
        </button>
      </div>
    </form>
  )
}
