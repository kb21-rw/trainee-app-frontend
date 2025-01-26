import React, { useState } from "react"
import { useGetFormQuery } from "../../features/user/backendApi"
import Loader from "../../components/ui/Loader"
import { useParams } from "react-router-dom"
import EditableFormCard from "../../components/ui/EditableFormCard"
import QuestionCard from "../../components/ui/QuestionCard"
import { AlertType, Cookie, TemplateQuestion } from "../../utils/types"
import { useCookies } from "react-cookie"
import { getErrorInfo } from "../../utils/helper"
import { handleShowAlert } from "../../utils/handleShowAlert"
import { useDispatch } from "react-redux"

export default function Form() {
  const [cookies] = useCookies([Cookie.jwt])
  const dispatch = useDispatch()
  const { id } = useParams<{ id: string }>()
  const {
    data: form,
    isFetching,
    error,
  } = useGetFormQuery({
    id: id || "",
    jwt: cookies.jwt,
  })
  const [activeQuestion, setActiveQuestion] = useState<string>("")

  const { questionIds: questions = [], ...formProps } = form ?? {}

  if (isFetching) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (error) {
    const { message } = getErrorInfo(error)
    handleShowAlert(dispatch, {
      type: AlertType.Error,
      message,
    })
  }

  return (
    <div className="py-12 max-w-5xl mx-auto">
      <div className="flex flex-col gap-4">
        <EditableFormCard
          form={formProps}
          activeQuestion={activeQuestion}
          setActiveQuestion={setActiveQuestion}
        />
        <div className="flex flex-col gap-4">
          {questions.map((question: TemplateQuestion) => (
            <QuestionCard
              key={question._id}
              activeQuestion={activeQuestion}
              setActiveQuestion={setActiveQuestion}
              question={question}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
