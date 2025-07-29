import InputField from "../ui/InputField"
import Button from "../ui/Button"
import {
  ButtonVariant,
  Decision,
  DecisionInfo,
  ParticipantPhase,
  UserRow,
} from "../../utils/types"
import { Modal } from "@mui/material"
import CloseIcon from "../../assets/CloseIcon"

export default function SettingsModal({
  row,
  onClose = () => undefined,
  handleDecision = () => undefined,
  type = "applicant",
}: {
  row: UserRow
  handleDecision?: (_row: DecisionInfo) => void
  onClose: () => void
  type?: "applicant" | "trainee"
}) {
  const handleReject = () => {
    onClose()
    handleDecision({
      traineeId: row?.traineeId,
      decision: Decision.Rejected,
      email: row?.email,
      name: row?.name,
      stage: row?.stage,
    })
  }

  const handleAccept = () => {
    onClose()
    handleDecision({
      traineeId: row?.traineeId,
      decision: Decision.Accepted,
      email: row?.email,
      name: row?.name,
      stage: row?.stage,
    })
  }

  const title = type === "trainee" ? "Trainee Settings" : "Participant Settings"

  return (
    <Modal
      open={Boolean(row?.id)}
      onClose={onClose}
      aria-labelledby={title}
      aria-describedby=""
      component="div"
      className="flex items-center max-w-md mx-auto"
    >
      <form className="flex flex-col w-full gap-10 p-5 bg-white rounded-xl">
        <div className="flex items-center justify-center">
          <h1 className="text-3xl font-semibold text-center">{title}</h1>
          {row?.actions !== ParticipantPhase.Active && (
            <Button
              onClick={onClose}
              variant={ButtonVariant.XIcon}
              className="relative -right-9"
            >
              <CloseIcon />
            </Button>
          )}
        </div>
        <div className="space-y-4">
          <InputField
            type="text"
            label="Name"
            disabled
            name="name"
            defaultValue={row?.name ?? ""}
          />
          <InputField
            type="text"
            label="Stage"
            disabled
            name="stage"
            defaultValue={row?.stage ?? ""}
          />
          <InputField
            type="text"
            label="Coach"
            disabled
            name="coach"
            defaultValue={row?.coachName ?? ""}
          />
        </div>
        <div className="flex justify-around gap-2">
          {row?.actions === ParticipantPhase.Active && (
            <>
              <Button variant={ButtonVariant.Danger} onClick={handleReject}>
                Reject
              </Button>

              <Button onClick={handleAccept}>Accept</Button>
            </>
          )}
        </div>
      </form>
    </Modal>
  )
}
