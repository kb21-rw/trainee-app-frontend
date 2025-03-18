import Button from "../ui/Button"
import { useForm } from "react-hook-form"
import { Modal } from "@mui/material"
import ApplicationFormQuestion from "../ui/ApplicatonFormQuestion"
import { AlertType, Cookie, ResponseModalQuestion } from "../../utils/types"
import { useAddResponseMutation } from "../../features/user/backendApi"
import { useDispatch } from "react-redux"
import { getErrorInfo } from "../../utils/helper"
import { handleShowAlert } from "../../utils/handleShowAlert"
import { useCookies } from "react-cookie"

const ResponseModal = ({
  responseInfo: { userId, question },
  closeModal,
}: {
  responseInfo: { userId: string; question: ResponseModalQuestion }
  closeModal: () => void
}) => {
  const [cookies] = useCookies([Cookie.jwt])
  const { handleSubmit, control } = useForm()
  const [addResponse, { error, isSuccess }] = useAddResponseMutation()
  const dispatch = useDispatch()

  const onSubmit = async (response: {
    [questionId: string]: string | string[]
  }) => {
    const responseElements = Object.entries(response)
    await addResponse({
      jwt: cookies.jwt,
      body: {
        userId,
        value: responseElements[0][1],
        questionId: responseElements[0][0],
      },
    })
  }

  const includeButton = true

  if (error) {
    const { message } = getErrorInfo(error)
    handleShowAlert(dispatch, {
      type: AlertType.Error,
      message,
    })

    closeModal()
  }

  if (isSuccess) {
    handleShowAlert(dispatch, {
      type: AlertType.Success,
      message: "Response was added successfully",
    })

    closeModal()
  }

  return (
    <Modal
      open={Boolean(userId)}
      onClose={closeModal}
      aria-labelledby="Title"
      aria-describedby="description"
      component="div"
      className="max-w-xl mx-auto flex items-center "
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white flex flex-col gap-8 w-full px-8 py-6 rounded-xl"
      >
        <h1 className="text-2xl font-semibold">JavaScript Gate</h1>
        <div>
          <label
            htmlFor={question._id}
            className="text-lg inline-block mb-3 font-"
          >
            {question.prompt}
          </label>
          <ApplicationFormQuestion question={question} control={control} />
        </div>
        <div className="flex justify-around">
          {
            <Button outlined onClick={closeModal}>
              Cancel
            </Button>
          }
          {includeButton && <Button type="submit">Save Response</Button>}
        </div>
      </form>
    </Modal>
  )
}

export default ResponseModal
