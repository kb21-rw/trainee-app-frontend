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
  ApplicationForm,
  Cookie,
  Form,
  FormType,
  QuestionType,
} from "../../utils/types"
import { useCookies } from "react-cookie"
import classNames from "classnames"
import { DatePicker } from "@mui/x-date-pickers"
import dayjs from "dayjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dispatch, SetStateAction } from "react"

const FormSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  stages: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string(),
        description: z.string(),
      }),
    )
    .optional(),
})

interface UpdateFormProps {
  form: ApplicationForm | Form
  activeQuestion: string
  setActiveQuestion: Dispatch<SetStateAction<string>>
}

export default function UpdateFormCard({
  form,
  activeQuestion,
  setActiveQuestion,
}: UpdateFormProps) {
  const [cookies] = useCookies([Cookie.jwt])
  const {
    control,
    register,
    handleSubmit,
    formState: { isDirty, dirtyFields, errors },
  } = useForm({
    resolver: zodResolver(FormSchema),
    // defaultValues: { name, description, ...rest },
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

  const onSubmit = async (data: any) => {
    console.log("======= In submit ========")
    console.log(data)
    console.log({ dirtyFields, errors })
    return
    await editForm({
      jwt: cookies.jwt,
      body: { ...data, type: form.type },
      _id: form._id,
    })
  }

  const handleAddQuestion = async () => {
    await createQuestion({
      jwt: cookies.jwt,
      formId: form._id,
      body: { prompt: `Question`, type: QuestionType.Text },
    })
  }

  console.log({ errors, dirtyFields, isDirty })
  // console.log({ name, description, _id, type, ...rest })

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
          className="outline-none text-[42px] font-bold border-b border-black"
          defaultValue={form.name}
          {...register("name")}
        />
        <input
          placeholder="Enter description"
          className="outline-none border-b border-black"
          defaultValue={form.description}
          {...register("description")}
        />
        {form.type === FormType.Application && (
          <div className="flex justify-between">
            <Controller
              name="startDate"
              control={control}
              defaultValue={dayjs(form.startDate)}
              render={({ field, ...props }) => (
                <DatePicker
                  minDate={dayjs().add(1, "day")}
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => {
                    field.onChange(date)
                  }}
                  label="Application open date"
                  {...props}
                />
              )}
            />
            <Controller
              name="endDate"
              control={control}
              defaultValue={dayjs(form.endDate)}
              render={({ field, ...props }) => (
                <DatePicker
                  minDate={dayjs().add(2, "day")}
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => {
                    field.onChange(date)
                  }}
                  label="Application close date"
                  {...props}
                />
              )}
            />
          </div>
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
