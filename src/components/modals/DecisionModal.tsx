import { useForm } from "react-hook-form";
import ModalLayout from "./ModalLayout";
import InputField from "../ui/InputField";
import Button from "../ui/Button";
import { ButtonVariant, Decision, DecisionInfo } from "../../utils/types";
import TextArea from "../ui/TextArea";

export default function DecisionModal({
  decisionInfo: { decision, email, name, stage },
  onSubmit,
  closeModal,
}: {
  decisionInfo: DecisionInfo;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (_data: { feedback: string }) => void;
  closeModal: () => void;
}) {
  const { register, handleSubmit } = useForm<{ feedback: string }>();

  const modalData =
    decision === Decision.Rejected
      ? { variant: ButtonVariant.Danger, title: "Reject user" }
      : { variant: ButtonVariant.Primary, title: "Accept user" };

  return (
    <ModalLayout closePopup={closeModal} title={modalData.title}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-full"
      >
        <InputField
          type="text"
          label="Name"
          disabled
          name="name"
          defaultValue={name}
        />
        <InputField
          type="email"
          label="Email"
          disabled
          name="email"
          defaultValue={email}
        />
        <InputField
          type="text"
          label="Stage"
          disabled
          name="stage"
          defaultValue={stage}
        />
        <div>
          <TextArea
            label="Feedback"
            placeholder="Enter feedback here"
            name="feedback"
            register={register}
            defaultValue=""
          />
        </div>
        <div className="flex justify-around gap-2">
          <Button outlined onClick={closeModal}>
            Cancel
          </Button>

          <Button variant={modalData.variant} type="submit">
            Confirm
          </Button>
        </div>
      </form>
    </ModalLayout>
  );
}
