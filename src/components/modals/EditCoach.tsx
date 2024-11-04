import { useEditCoachMutation } from "../../features/user/backendApi";
import { useForm } from "react-hook-form";
import ModalLayout from "./ModalLayout";
import InputField from "../ui/InputField";
import Button from "../ui/Button";
import Loader from "../ui/Loader";
import { AlertType, UserRole } from "../../utils/types";
import { getErrorInfo } from "../../utils/helper";
import { handleShowAlert } from "../../utils/handleShowAlert";
import { useDispatch } from "react-redux";

const EditCoachModal = ({
  closePopup,
  jwt,
  coachData,
}: {
  closePopup: () => void;
  jwt: string;
  coachData: string[];
}) => {
  const [editCoach, { isLoading, isSuccess, error }] = useEditCoachMutation();
  const dispatch = useDispatch();

  const roles = [UserRole.Admin, UserRole.Coach];

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    await editCoach({ jwt, id: coachData[0], body: { ...data } });
  };

  if (error) {
    const { message } = getErrorInfo(error);
    handleShowAlert(dispatch, {
      type: AlertType.Error,
      message,
    });
  }

  if (isSuccess) {
    handleShowAlert(dispatch, {
      type: AlertType.Success,
      message: "Coach was updated successfully",
    });
  }

  return (
    <ModalLayout closePopup={closePopup} title="Edit user">
      {isLoading && (
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-12 w-full"
      >
        <InputField
          type="text"
          label="Name"
          placeholder=""
          name="name"
          defaultValue={coachData[1]}
          register={register}
          options={{
            required: { value: true, message: "name is required field" },
          }}
        />
        <InputField
          type="text"
          label="Email address"
          placeholder=""
          name="email"
          defaultValue={coachData[2]}
          register={register}
          options={{
            required: { value: true, message: "email is required field" },
            maxLength: {
              value: 30,
              message: "Name must not exceed 30 characters",
            },
          }}
        />
        <div className="flex flex-col gap-5">
          <label htmlFor="role" className="text-lg font-medium">
            Role :
          </label>

          <select
            className="form-select rounded-xl h-[58px] border-gray-200"
            {...register("role")}
          >
            {roles.map((role: any, index: number) => (
              <option key={index} value={role} selected={role === coachData[3]}>
                {role}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <Button outlined onClick={closePopup}>
            Cancel
          </Button>
          <Button>Save</Button>
        </div>
      </form>
    </ModalLayout>
  );
};

export default EditCoachModal;
