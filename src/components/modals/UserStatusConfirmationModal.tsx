import { Modal } from "@mui/material"
import Button from "../ui/Button"
import { ButtonVariant, UserRole } from "../../utils/types"
import Loader from "../ui/Loader"

interface UserStatusConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  isUserActive: boolean
  userName: string
  onConfirm: () => Promise<void>
  isLoading: boolean
  userRole: UserRole
}

export default function UserStatusConfirmationModal({
  isOpen,
  onClose,
  isUserActive,
  onConfirm,
  isLoading,
  userRole,
}: UserStatusConfirmationModalProps) {
  const action = isUserActive ? "deactivate" : "activate"
  const actionCapitalized = isUserActive ? "Deactivate" : "Activate"

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-describedby={`Confirm ${action} admin`}
      component="div"
      className="max-w-md mx-auto flex items-center"
    >
      <div className="flex flex-col gap-6 w-full bg-white p-5 rounded-xl">
        <h1 className="text-center text-2xl font-semibold">
          {actionCapitalized} {userRole}
        </h1>

        <p className="text-center">
          Confirm if you want to {action} this {userRole.toLowerCase()}.
        </p>

        <div className="flex justify-around gap-2">
          <Button outlined onClick={onClose}>
            Cancel
          </Button>

          <Button
            onClick={onConfirm}
            disabled={isLoading}
            variant={
              isUserActive ? ButtonVariant.Danger : ButtonVariant.Primary
            }
          >
            <span className="flex items-center gap-1">
              {isLoading ? <Loader borderColor="#fff" size="xs" /> : ""}
              <span>{actionCapitalized}</span>
            </span>
          </Button>
        </div>
      </div>
    </Modal>
  )
}
