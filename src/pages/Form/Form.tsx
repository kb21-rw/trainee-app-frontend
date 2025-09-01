import { useGetFormQuery } from "../../features/user/backendApi"
import Loader from "../../components/ui/Loader"
import { Link, useLocation, useParams, useSearchParams } from "react-router-dom"
import EditableFormCard from "../../components/ui/EditableFormCard"
import QuestionCard from "../../components/ui/QuestionCard"
import { AlertType, TemplateQuestion } from "../../utils/types"
import { getErrorInfo } from "../../utils/helper"
import { handleShowAlert } from "../../utils/handleShowAlert"
import { useDispatch } from "react-redux"
import BackIcon from "../../assets/BackIcon"

export default function Form() {
  const [searchParams] = useSearchParams()
  const isEditMode = searchParams.get("edit") === "true"
  const dispatch = useDispatch()
  const { id } = useParams<{ id: string }>()
  const {
    data: form,
    isFetching,
    error,
  } = useGetFormQuery({
    id: id || "",
  })

  const { questionIds: questions = [], ...formProps } = form ?? {}
  const { activeCohortId } = useLocation().state || {}

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
    <div className="max-w-5xl py-12 mx-auto lg:grid-cols-12 lg:grid">
      <div className="lg:col-span-1">
        <Link to=".." state={{ activeCohortId }} relative="path">
          <BackIcon />
        </Link>
      </div>
      <div className="flex flex-col gap-4 lg:col-span-11">
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
      </div>
    </div>
  )
}
