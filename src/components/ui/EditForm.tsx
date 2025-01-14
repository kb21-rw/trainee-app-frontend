import React from "react"
import CheckMark from "../../assets/CheckMarkIcon"
import AddIcon from "../../assets/AddIcon"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import {
  useCreateQuestionMutation,
  useDeleteFormMutation,
  useEditFormMutation,
} from "../../features/user/backendApi"
import SuccessCheckMark from "../../assets/SuccessCheckMarkIcon"
import Delete from "../../assets/DeleteIcon"
import Loader from "./Loader"
import { useNavigate } from "react-router-dom"
import { Cookie, FormType, QuestionType } from "../../utils/types"
import { useCookies } from "react-cookie"
import classNames from "classnames"

const FormSchema = yup.object({
  name: yup.string().required(),
  description: yup.string().required(),
})

const EditForm = ({
  name,
  description,
  id,
  type,
  activeQuestion,
  setActiveQuestion,
}: {
  name: string
  description: string
  id: string
  type: FormType
  activeQuestion: string
  setActiveQuestion: any
}) => {
  const [cookies] = useCookies([Cookie.jwt])
  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm({
    defaultValues: { name, description },
    resolver: yupResolver(FormSchema),
  })

  const [editForm] = useEditFormMutation()
  const navigate = useNavigate()
  const onSubmit = async (data: any) => {
    await editForm({ jwt: cookies.jwt, body: { ...data, type }, id })
  }

  const [deleteForm, { isLoading: isDeleteFormLoading }] =
    useDeleteFormMutation()
  const handleDeleteForm = async () => {
    await deleteForm({ jwt: cookies.jwt, id })
    navigate(`/forms`)
  }

  const [createQuestion] = useCreateQuestionMutation()
  const onClickAddQuestion = async () => {
    await createQuestion({
      jwt: cookies.jwt,
      formId: id,
      body: { prompt: `Question`, type: QuestionType.Text },
    })
  }

  return (
    <form className="flex gap-2 " onFocus={() => setActiveQuestion("title")}>
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
          defaultValue={name}
          {...register("name")}
        />
        <input
          placeholder="Enter description"
          className="outline-none border-b border-black"
          defaultValue={description}
          {...register("description")}
        />
      </div>
      <div className="flex flex-col justify-between gap-6 p-4 custom-shadow rounded-xl">
        {isDirty ? (
          <button type="submit" onClick={handleSubmit(onSubmit)}>
            <SuccessCheckMark />
          </button>
        ) : (
          <CheckMark />
        )}
        <button type="button" onClick={onClickAddQuestion}>
          <AddIcon />
        </button>
        <button type="button" onClick={handleDeleteForm}>
          <Delete />
        </button>
      </div>
    </form>
  )
}

export default EditForm
