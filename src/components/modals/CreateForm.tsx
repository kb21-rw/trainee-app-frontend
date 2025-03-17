import { Modal } from "@mui/material"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import { useCreateFormMutation } from "../../features/user/backendApi"
import { useCookies } from "react-cookie"
import { AlertType, Cookie, FormType } from "../../utils/types"
import { onCreateFormSubmit } from "../../utils/helper"
import Loader from "../../components/ui/Loader"
import { useDispatch } from "react-redux"
import { handleShowAlert } from "../../utils/handleShowAlert"


interface CreateFormModalProps {
  isOpen: boolean
  onClose: () => void
  formType: FormType
}

const CreateFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
})

export type CreateFormInput = z.infer<typeof CreateFormSchema>

export default function CreateForm({
  isOpen,
  onClose,
  formType,
}: CreateFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateFormInput>({
    resolver: zodResolver(CreateFormSchema),
  })

  const dispatch = useDispatch()
  const [cookies] = useCookies([Cookie.jwt])
  const [createForm, { isLoading }] = useCreateFormMutation()

  const onSubmit = async (data: CreateFormInput) => {
    await onCreateFormSubmit({
      data,
      formType,
      cookies,
      createForm,
      reset,
      dispatch,
      onClose
    })
    handleShowAlert(dispatch, {
      type: AlertType.Success,
      message: "Form created successfully!"
    })
  }

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        reset()
        onClose()
      }}
      aria-labelledby="create-form-modal"
      className="flex items-center max-w-md mx-auto"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-6 p-5 bg-white rounded-xl"
      >
        <h1 className="text-3xl font-semibold text-center">
          Create {formType} Form
        </h1>
        <Input
          register={{ ...register("title") }}
          label="Form Title *"
          error={errors.title?.message}
        />
        <Input
          register={{ ...register("description") }}
          label="Form Description"
          error={errors.description?.message}
        />
        <div className="flex justify-around gap-2">
          <Button
            outlined
            type="button"
            onClick={() => {
              reset()
              onClose()
            }}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader borderColor="#fff" size="xs" /> : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
