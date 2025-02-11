import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { PlusIcon } from "@radix-ui/react-icons"
import { useCreateFormMutation } from "../../features/user/backendApi"
import { useNavigate } from "react-router-dom"
import { AlertType, Cookie, FormType } from "../../utils/types"
import classNames from "classnames"
import { useCookies } from "react-cookie"
import dayjs from "dayjs"
import { getErrorInfo } from "../../utils/helper"
import { handleShowAlert } from "../../utils/handleShowAlert"
import { useDispatch } from "react-redux"

const menuItems = [
  { label: "Create a new form for Trainees", type: FormType.Trainee },
  { label: "Create a new form for Applicants", type: FormType.Applicant },
]

interface CreateFormDropdownProps {
  applicationFormExists: boolean
}

export default function CreateFormDropdown({
  applicationFormExists,
}: CreateFormDropdownProps) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [cookies] = useCookies([Cookie.jwt])

  const [createForm] = useCreateFormMutation()

  const potentialForms = applicationFormExists
    ? menuItems
    : [
        {
          label: "Create a new Application form",
          type: FormType.Application,
        },
        ...menuItems,
      ]

  const handleCreateForm = async (type: FormType) => {
    const nextFormTitle = `${type} form name...`
    const requestBody: {
      name: string
      type: FormType
      startDate?: string
      endDate?: string
      stages?: { name: string }[]
    } = { name: nextFormTitle, type }

    if (type === FormType.Application) {
      requestBody.startDate = dayjs().add(1, "day").toISOString()
      requestBody.endDate = dayjs().add(2, "day").toISOString()
      requestBody.stages = [{ name: "Application" }]
    }

    try {
      const result = await createForm({ jwt: cookies.jwt, body: requestBody })

      if (result.error) {
        throw result.error
      }

      navigate(`/forms/${result?.data?._id}`)
    } catch (error) {
      const { message } = getErrorInfo(error)
      handleShowAlert(dispatch, {
        type: AlertType.Error,
        message,
      })
    }
  }

  return (
    <Menu>
      <MenuButton className="flex items-center gap-2 bg-primary-dark text-white px-4 py-3 rounded">
        <PlusIcon />
        Create form
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom end"
        className="origin-top-right rounded-lg border border-white/5 bg-white text-sm text-gray-500 font-medium transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 custom-shadow"
      >
        {potentialForms.map((item, index) => (
          <MenuItem key={index}>
            <button
              className={classNames(
                "group flex w-full items-center py-3 px-5 data-[focus]:bg-primary-dark data-[focus]:text-white border-b",
                { "border-none": index === potentialForms.length - 1 },
              )}
              onClick={() => handleCreateForm(item.type)}
            >
              {item.label}
            </button>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  )
}
