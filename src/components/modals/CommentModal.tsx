import Button from "../ui/Button"
import { useForm } from "react-hook-form"
import { Modal, TextField } from "@mui/material"
import { AlertType, ButtonVariant } from "../../utils/types"
import { useUpdateParticipantMutation } from "../../features/user/backendApi"
import { useDispatch } from "react-redux"
import { getErrorInfo } from "../../utils/helper"
import { handleShowAlert } from "../../utils/handleShowAlert"
import CloseIcon from "../../assets/CloseIcon"

export default function CommentModal({
  commentInfo: { userId, name, comment, readonly = false },
  closeModal,
}: {
  commentInfo: {
    userId: string
    comment: string
    name: string
    readonly?: boolean
  }
  closeModal: () => void
}) {
  const {
    handleSubmit,
    register,
    formState: { isDirty },
  } = useForm<{ comment: string }>({
    mode: "onSubmit",
    defaultValues: { comment: comment || "" },
  })

  const [updateComment, { error, isSuccess }] = useUpdateParticipantMutation()
  const dispatch = useDispatch()

  const onSubmit = async ({ comment }: { comment: string }) => {
    await updateComment({
      participantId: userId,
      body: {
        comment,
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
      message: "Comment was added successfully",
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
          <h1 className="text-2xl font-semibold">{name}</h1>
          <Button
            onClick={closeModal}
            variant={ButtonVariant.XIcon}
            className="p-2 border border-gray-300 rounded-md"
          >
            <CloseIcon />
          </Button>
        </div>

        <div>
          <label htmlFor={comment} className="inline-block mb-3 text-lg font-">
            Comments
          </label>
        </div>
        <TextField
          {...register("comment")}
          disabled={readonly}
          placeholder="Type your comment here"
        />

        {includeButton && (
          <div className="flex justify-around">
            <Button outlined onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isDirty}>
              {" "}
              Save Comment
            </Button>
          </div>
        )}
      </form>
    </Modal>
  )
}
