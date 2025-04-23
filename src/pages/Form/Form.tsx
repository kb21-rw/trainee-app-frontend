import { useGetFormQuery } from "../../features/user/backendApi"
import Loader from "../../components/ui/Loader"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import EditableFormCard from "../../components/ui/EditableFormCard"
import QuestionCard from "../../components/ui/QuestionCard"
import { AlertType, Cookie, TemplateQuestion } from "../../utils/types"
import { useCookies } from "react-cookie"
import { getErrorInfo } from "../../utils/helper"
import { handleShowAlert } from "../../utils/handleShowAlert"
import { useDispatch } from "react-redux"
import Button from "../../components/ui/Button"

export default function Form() {
  const [searchParams] = useSearchParams()
  const isEditMode = searchParams.get("edit") === "true"
  const [cookies] = useCookies([Cookie.jwt])
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const {
    data: form,
    isFetching,
    error,
  } = useGetFormQuery({
    id: id || "",
    jwt: cookies.jwt,
  })

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
    <div className="max-w-5xl py-12 mx-auto">
      <div className="flex flex-col gap-4">
        <EditableFormCard form={formProps} readonly={!isEditMode} />
        <div className="flex flex-col gap-4">
          {questions.map((question: TemplateQuestion) => (
            <QuestionCard
              key={question._id}
              question={question}
              readonly={!isEditMode}
            />
          ))}
        </div>
        <div className="flex pt-44 justify-self-end">
          <Button onClick={() => navigate(-1)}>Back to form list</Button>
        </div>
      </div>
    </div>
  )
}
