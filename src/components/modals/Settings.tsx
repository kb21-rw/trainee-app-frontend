import InputField from "../ui/InputField";
import Button from "../ui/Button";
import {
  ButtonVariant,
  Decision,
  DecisionInfo,
  ParticipantPhase,
} from "../../utils/types";
import { Modal } from "@mui/material";

export default function SettingsModal({
  row,
  onClose = () => undefined,
  handleDecision = () => undefined,
}: {
  row: any;
  // eslint-disable-next-line no-unused-vars
  handleDecision?: (_row: DecisionInfo) => void;
  onClose: () => void;
}) {
  const handleReject = () => {
    onClose();
    handleDecision({
      userId: row?.id,
      decision: Decision.Rejected,
      email: row?.email,
      name: row?.name,
      stage: row?.stage,
    });
  };

  const handleAccept = () => {
    onClose();
    handleDecision({
      userId: row?.id,
      decision: Decision.Accepted,
      email: row?.email,
      name: row?.name,
      stage: row?.stage,
    });
  };

  return (
    <Modal
      open={Boolean(row?.id)}
      onClose={onClose}
      aria-labelledby="Participant Settings"
      aria-describedby=""
      component="div"
      className="max-w-md mx-auto flex items-center"
    >
      <form className="flex flex-col gap-10 w-full bg-white p-5 rounded-xl">
        <h1 className="text-center text-3xl font-semibold">
          Participant Settings
        </h1>
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
          {row?.actions !== ParticipantPhase.Active && (
            <Button onClick={onClose} outlined>
              Close modal
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
}
