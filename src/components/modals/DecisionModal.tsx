import { useForm } from "react-hook-form";
import InputField from "../ui/InputField";
import Button from "../ui/Button";
import { ButtonVariant, Decision, DecisionInfo } from "../../utils/types";
import TextArea from "../ui/TextArea";
import { Modal } from "@mui/material";
import { useEffect } from "react";

export default function DecisionModal({
  decisionInfo,
  onSubmit,
  closeModal,
}: {
  decisionInfo: DecisionInfo | null;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (_data: { feedback: string }) => void;
  closeModal: () => void;
}) {
  const { register, handleSubmit, resetField } = useForm<{
    feedback: string;
  }>();

  const modalData =
    decisionInfo?.decision === Decision.Rejected
      ? { variant: ButtonVariant.Danger, title: "Reject user" }
      : { variant: ButtonVariant.Primary, title: "Accept user" };

  useEffect(() => {
    if (!decisionInfo) {
      resetField("feedback");
    }
  }, [decisionInfo, resetField]);

  return (
    <Modal
      open={Boolean(decisionInfo?.decision)}
      onClose={closeModal}
      aria-labelledby={modalData.title}
      aria-describedby={`${modalData.title.split(" ")[0]} decision`}
      component="div"
      className="max-w-md mx-auto flex items-center "
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-full bg-white p-5 rounded-xl"
      >
        <h1 className="text-center text-3xl font-semibold">
          {modalData.title}
        </h1>
        <InputField
          type="text"
          label="Name"
          disabled
          name="name"
          defaultValue={decisionInfo?.name ?? ""}
        />
        <InputField
          type="email"
          label="Email"
          disabled
          name="email"
          defaultValue={decisionInfo?.email ?? ""}
        />
        <InputField
          type="text"
          label="Stage"
          disabled
          name="stage"
          defaultValue={decisionInfo?.stage ?? ""}
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
    </Modal>
  );
}
