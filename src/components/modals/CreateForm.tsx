import { Modal } from "@mui/material"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import { useCreateFormMutation } from "../../features/user/backendApi"
import { useCookies } from "react-cookie"
import { Cookie, FormType, AlertType } from "../../utils/types"
import { getErrorInfo } from "../../utils/helper"
import { handleShowAlert } from "../../utils/handleShowAlert"
import Loader from "../../components/ui/Loader"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

interface CreateFormModalProps {
  isOpen: boolean
  onClose: () => void
  formType: FormType
}

const CreateFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
})

type CreateFormInput = z.infer<typeof CreateFormSchema>

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
  const navigate = useNavigate()
  const [cookies] = useCookies([Cookie.jwt])
  const [createForm, { isLoading }] = useCreateFormMutation()

  const onSubmit = async (data: CreateFormInput) => {
    const requestBody: {
      name: string;
      type: FormType;
      description?: string;
      startDate?: string;
      endDate?: string;
      stages?: { name: string }[];
    } = {
      name: data.title,
      type: formType,
    }

    if (data.description) {
      requestBody.description = data.description
    }

    if (formType === FormType.Application) {
      const now = new Date()
      requestBody.startDate = new Date(
        now.getTime() + 24 * 60 * 60 * 1000,
      ).toISOString()
      requestBody.endDate = new Date(
        now.getTime() + 48 * 60 * 60 * 1000,
      ).toISOString()
      requestBody.stages = [{ name: "Application" }]
    }

    try {
      const result = await createForm({
        jwt: cookies.jwt,
        body: requestBody,
      }).unwrap()
      navigate(`/forms/${result._id}?edit=true`)
    } catch (error) {
      const { message } = getErrorInfo(error)
      handleShowAlert(dispatch, {
        type: AlertType.Error,
        message,
      })
    } finally {
      reset()
      onClose()
    }
  }

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        reset()
        onClose()
      }}
      aria-labelledby="create-form-modal"
      className="max-w-md mx-auto flex items-center"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-full bg-white p-5 rounded-xl"
      >
        <h1 className="text-center text-3xl font-semibold">
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
