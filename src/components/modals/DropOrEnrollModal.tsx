import { useForm } from "react-hook-form";
import ModalLayout from "./ModalLayout";
import InputField from "../ui/InputField";
import Button from "../ui/Button";
import { AlertType, ApplicantDecision, ButtonVariant } from "../../utils/types";
import TextArea from "../ui/TextArea";
import { useApplicantDecisionMutation } from "../../features/user/backendApi";
import Loader from "../ui/Loader";
import useAutoCloseModal from "../../utils/hooks/useAutoCloseModal";
import { getErrorInfo } from "../../utils/helper";
import { handleShowAlert } from "../../utils/handleShowAlert";
import { useDispatch } from "react-redux";
import { stages } from "../../mocks/stages.mock";

const DropOrEnrollModal = ({
  closePopup,
  userName,
  userEmail,
  decideForUserId,
  jwt,
  decision,
}: {
  closePopup: () => void;
  userName: string;
  userEmail: string;
  decideForUserId: string | null;
  jwt: string;
  decision: ApplicantDecision;
}) => {
  const dispatch = useDispatch();
  const { register, handleSubmit, watch } = useForm();

  const [
    rejectUser,
    { isLoading: isRejectUserLoading, error, isSuccess: isRejectUserSuccess },
  ] = useApplicantDecisionMutation();

  const handleRejectUser = async () => {
    if (decideForUserId) {
      await rejectUser({
        jwt,
        body: {
          decision: decision,
          stageId: watch("StageId"),
          feedback: watch("feedback"),
          userId: decideForUserId,
        },
      });
    }
  };

  const onSubmit = async () => {
    handleRejectUser();
  };

  useAutoCloseModal(isRejectUserSuccess, closePopup);

  if (error) {
    const { message } = getErrorInfo(error);
    handleShowAlert(dispatch, {
      type: AlertType.Error,
      message,
    });
  }

  if (isRejectUserSuccess) {
    handleShowAlert(dispatch, {
      type: AlertType.Success,
      message: `${
        decision === ApplicantDecision.Rejected
          ? `Dropped ${userName}`
          : `Enrolled ${userName} to the next stage`
      }`,
    });
  }

  return (
    <ModalLayout
      closePopup={closePopup}
      title={`${
        decision == ApplicantDecision.Rejected
          ? `Drop ${userName}`
          : `Enroll ${userName} To the next stage`
      }`}
    >
      <div>
        {isRejectUserLoading && (
          <div className="w-full bg-gray-500/60 flex justify-center items-center">
            <Loader />
          </div>
        )}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-12 w-full"
      >
        <InputField
          type="text"
          label="Name"
          placeholder=""
          name="name"
          defaultValue={userName}
          register={register}
          options={{
            required: { value: true, message: "name is required field" },
            maxLength: {
              value: 30,
              message: "Name must not exceed 30 characters",
            },
          }}
        />
        <InputField
          type="email"
          label="Email address"
          placeholder=""
          name="email"
          defaultValue={userEmail}
          register={register}
          options={{
            required: { value: true, message: "Email is required field" },
          }}
        />
        <div className="flex flex-col gap-5">
          <label htmlFor="role" className="text-lg font-medium">
            Choose stage
          </label>

          <select
            className="form-select rounded-xl h-[58px] border-gray-200"
            {...register("StageId")}
          >
            {stages?.map((stage: any) => (
              <option key={stage.id} value={stage.id}>
                {stage.description}
              </option>
            ))}
          </select>
        </div>
        <div>
          <TextArea
            label="Reason for rejection or Feedback"
            placeholder="Enter feedback here"
            name="feedback"
            register={register}
            defaultValue=""
            options={{
              required: { value: true, message: "response is required" },
              maxLength: {
                message: "Add your response here",
              },
            }}
          />
        </div>
        <div className="flex gap-2">
          <Button outlined onClick={closePopup}>
            Cancel
          </Button>
          {decision === ApplicantDecision.Rejected && (
            <Button variant={ButtonVariant.Danger} type="submit">
              <span className="flex items-center justify-center">
                Confirm{" "}
                {isRejectUserLoading && (
                  <span>
                    <Loader />
                  </span>
                )}
              </span>
            </Button>
          )}
          {decision === ApplicantDecision.Accepted && (
            <Button variant={ButtonVariant.Primary} type="submit">
              <span className="flex items-center justify-center">
                Confirm{" "}
                {isRejectUserLoading && (
                  <span>
                    <Loader />
                  </span>
                )}
              </span>
            </Button>
          )}
        </div>
      </form>
    </ModalLayout>
  );
};

export default DropOrEnrollModal;
