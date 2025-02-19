import { useState } from "react"
import { H2, H6, H7 } from "./Typography"
import { Cookie, IFormType } from "../../utils/types"
import Delete from "../../assets/DeleteIcon"
import Edit from "../../assets/EditIcon"
import { useDeleteFormMutation } from "../../features/user/backendApi"
import { useNavigate } from "react-router-dom"
import View from "../../assets/ViewIcon"
import Loader from "./Loader"
import DeleteModal from "../modals/DeleteModal"
import { useCookies } from "react-cookie"

const FormCard = ({ form }: { form: IFormType }) => {
  const [cookies] = useCookies([Cookie.jwt])
  const navigate = useNavigate()
  const questions = form.questions
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [deleteForm, { isLoading: isDeleteFormLoading }] =
    useDeleteFormMutation()

  const handleDeleteForm = async (id: string) => {
    await deleteForm({ jwt: cookies.jwt, id })
    setShowDeleteModal(false)
  }

  return (
    <div className="p-8 custom-shadow flex items-center justify-between rounded-xl">
      {isDeleteFormLoading && (
        <div className="absolute inset-0 h-full w-full flex items-center justify-center">
          <Loader />
        </div>
      )}
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between">
          <div className="flex gap-2">
            <H2>{form.name}</H2>
            <div className="flex items-center gap-1 font-bold text-primary-dark border-primary-dark border rounded-lg px-6 ">
              <H7>{form.type}</H7>
            </div>
          </div>

          <div className="flex items-center gap-1 font-bold ">
            <H7>{questions}</H7>
            <H7>{questions === 1 ? "Question" : "Questions"}</H7>
          </div>
        </div>
        <H6>{form.description}</H6>
        <div className="flex justify-between">
          <button
            onClick={() => navigate(`/forms/${form._id}`)}
            className="flex items-center gap-2"
          >
            <View />
            <span>View</span>
          </button>
          <button
            onClick={() => navigate(`/forms/${form._id}?edit=true`)}
            className="flex items-center gap-2"
          >
            <Edit />
            <span>Edit</span>
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2"
          >
            <Delete />
            <span>Delete</span>
          </button>
        </div>
      </div>
      {showDeleteModal && (
        <DeleteModal
          title="a form"
          name={form.name}
          closePopup={() => setShowDeleteModal(false)}
          onDelete={() => handleDeleteForm(form._id)}
        />
      )}
    </div>
  )
}

export default FormCard
