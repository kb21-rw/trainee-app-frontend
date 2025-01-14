import { useLocation, useNavigate } from "react-router-dom"
import { useAddApplicantResponseMutation } from "../../features/user/backendApi"
import { getErrorInfo, getFormattedDate } from "../../utils/helper"
import { AlertType, Cookie, UserResponseQuestion } from "../../utils/types"
import Button from "../../components/ui/Button"
import { useEffect } from "react"
import { handleShowAlert } from "../../utils/handleShowAlert"
import { useDispatch } from "react-redux"
import { useCookies } from "react-cookie"
import ApplicationFormQuestionPreview from "../../components/ui/ApplicationFormQuestionPreview"

const PreviewApplicationPage = () => {
  const [cookies] = useCookies([Cookie.jwt])
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const { formPreview, responses, formData } = location.state || {}
  const [addApplicantResponse, { isSuccess, error }] =
    useAddApplicantResponseMutation()

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        window.location.href = "/home"
      }, 3000)

      return () => clearTimeout(timer)
    }

    return undefined
  }, [isSuccess])

  const handleConfirm = async () => {
    await addApplicantResponse({
      jwt: cookies.jwt,
      body: responses,
      action: "submit",
    })
  }

  const backToEdit = () => {
    navigate("/apply", { state: formData })
  }

  if (error) {
    const { message } = getErrorInfo(error)
    handleShowAlert(dispatch, {
      type: AlertType.Error,
      message,
    })
  }

  if (isSuccess) {
    handleShowAlert(dispatch, {
      type: AlertType.Success,
      message: "Successfully Applied, Redirecting to home page...",
    })
  }

  return (
    <div className="my-12 items-center justify-center flex flex-col p-5 custom-shadow border-t-primary-dark border-t-8 rounded-xl">
      <div className="p-4 text-center">
        <h1 className="font-bold text-xl sm:text-4xl">{formPreview.name}</h1>
        <p className="text-xs sm:text-base">
          Application deadline:{" "}
          <span className="font-bold">
            {getFormattedDate(formPreview.endDate)}
          </span>
        </p>
      </div>
      <div className="mb-8 p-4 rounded-t-xl md:w-4/5 w-full">
        {formPreview.questions.map(
          (question: UserResponseQuestion, index: number) => (
            <ApplicationFormQuestionPreview
              key={question._id}
              question={question}
              index={index + 1}
            />
          ),
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <Button outlined onClick={backToEdit}>
          <span className="flex items-center space-x-2">Back to edit</span>
        </Button>
        <Button onClick={handleConfirm}>
          <span className="flex items-center space-x-2">
            Submit Application
          </span>
        </Button>
      </div>
    </div>
  )
}

export default PreviewApplicationPage
