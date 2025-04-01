import { zodResolver } from "@hookform/resolvers/zod"
import { Modal } from "@mui/material"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import { UserRole } from "../../utils/types"

interface EditUserModalProps {
  isOpen: boolean
  onClose: () => void
}

const EditUserSchema = z.object({
  name: z.string().min(1, "You must provide the name"),
  role: z.nativeEnum(UserRole),
})

export type EditUserFormInput = z.infer<typeof EditUserSchema>

export default function EditUserModal({ isOpen, onClose }: EditUserModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditUserFormInput>({
    resolver: zodResolver(EditUserSchema),
  })

  //   const dispatch = useDispatch()
  //   const navigate = useNavigate()
  //   const [cookies] = useCookies([Cookie.jwt])
  //   const [createForm, { isLoading }] = useCreateFormMutation()

  const onSubmit = async (data: EditUserFormInput) => {
    // await onCreateFormSubmit({
    //   data,
    //   formType,
    //   cookies,
    //   createForm,
    //   navigate,
    //   reset,
    //   dispatch,
    //   onClose,
    // })
    console.log(data)
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
        <h1 className="text-3xl font-semibold text-center">Edit user form</h1>
        <Input
          register={{ ...register("name") }}
          label="User name"
          error={errors.name?.message}
        />
        <Input
          register={{ ...register("role") }}
          label="Role"
          error={errors.role?.message}
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
          <Button
            type="submit"
            //   disabled={isLoading}
          >
            {/* {isLoading ? <Loader borderColor="#fff" size="xs" /> : "Create"} */}
            Create
          </Button>
        </div>
      </form>
    </Modal>
  )
}
