import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { PlusIcon } from "@radix-ui/react-icons"
import { FormType } from "../../utils/types"
import classNames from "classnames"
import CreateForm from "../modals/CreateForm"
import { useState } from "react"

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
  const [isCreatFomModalOpen, setIsCreateFormModalOpen] = useState(false)
  const [selectedFormType, setSelectedFormType] = useState<FormType | null>(
    null,
  )

  const potentialForms = applicationFormExists
    ? menuItems
    : [
        {
          label: "Create a new Application form",
          type: FormType.Application,
        },
        ...menuItems,
      ]

  const handleCloseCreateFormModal = () =>
    setTimeout(() => setIsCreateFormModalOpen(false), 0)

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
              onClick={() => {
                setSelectedFormType(item.type)
                setIsCreateFormModalOpen(true)
              }}
            >
              {item.label}
            </button>
          </MenuItem>
        ))}
      </MenuItems>
      {selectedFormType && (
        <CreateForm
          isOpen={isCreatFomModalOpen}
          onClose={handleCloseCreateFormModal}
          formType={selectedFormType}
        />
      )}
    </Menu>
  )
}
