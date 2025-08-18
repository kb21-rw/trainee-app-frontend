import Button from "../ui/Button"
import { useForm } from "react-hook-form"
import { Modal } from "@mui/material"
import ApplicationFormQuestion from "../ui/ApplicatonFormQuestion"
import {
  AlertType,
  ButtonVariant,
  ResponseModalQuestion,
} from "../../utils/types"
import { useAddResponseMutation } from "../../features/user/backendApi"
import { useDispatch, useSelector } from "react-redux"
import { getErrorInfo } from "../../utils/helper"
import { handleShowAlert } from "../../utils/handleShowAlert"
import CloseIcon from "../../assets/CloseIcon"
import { RootState } from "../../store"

const ResponseModal = ({
  responseInfo: { userId, question, readonly = false },
  closeModal,
}: {
  responseInfo: {
    userId: string
    question: ResponseModalQuestion
    readonly?: boolean
  }
  closeModal: () => void
}) => {
  const cookies = useSelector((state: RootState) => state.cookies)
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

  const includeButton = !readonly

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
      className="flex items-center max-w-xl mx-auto"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-8 px-8 py-6 bg-white rounded-xl"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{question.form}</h1>
          <Button
            onClick={closeModal}
            variant={ButtonVariant.XIcon}
            className="p-2 border border-gray-300 rounded-md"
          >
            <CloseIcon />
          </Button>
        </div>

        <div>
          <label
            htmlFor={question._id}
            className="inline-block mb-3 text-lg font-"
          >
            {question.prompt}
          </label>
          <ApplicationFormQuestion
            question={question}
            control={control}
            disabled={readonly}
          />
        </div>

        {includeButton && (
          <div className="flex justify-around">
            <Button outlined onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit">Save Response</Button>
          </div>
        )}
      </form>
    </Modal>
  )
}

export default ResponseModal
