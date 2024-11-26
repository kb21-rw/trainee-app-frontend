import React from "react";
import ModalLayout from "./ModalLayout";
import InputField from "../ui/InputField";
import Button from "../ui/Button";
import { useForm } from "react-hook-form";
import {
  useCreateTraineeMutation,
  useGetAllCoachesQuery,
} from "../../features/user/backendApi";
import Loader from "../ui/Loader";
import { AlertType, UserRole } from "../../utils/types";
import { handleShowAlert } from "../../utils/handleShowAlert";
import { getErrorInfo } from "../../utils/helper";
import { useDispatch } from "react-redux";

const AddingTraineeModal = ({
  closePopup,
  jwt,
}: {
  closePopup: () => void;
  jwt: string;
}) => {
  const [createTrainee, { isLoading, error, isSuccess }] =
    useCreateTraineeMutation();
  const coachesData = useGetAllCoachesQuery({ jwt, query: "" });
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    if (!data?.coach) {
      delete data.coach;
    }

    await createTrainee({
      jwt,
      body: { ...data, role: UserRole.Trainee },
    });
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
      message: "Trainee was added successfully!",
    });
  }

  return (
    <ModalLayout closePopup={closePopup} title="Add trainee">
      {isLoading && (
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-full"
      >
        <InputField
          type="text"
          label="Name"
          placeholder="Trainee's name"
          name="name"
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
          label="Email adress"
          placeholder="Trainee's email"
          name="email"
          register={register}
          options={{
            required: { value: true, message: "Email is required field" },
          }}
        />
        <div className="flex flex-col gap-5">
          <label htmlFor="coach" className="text-lg font-medium">
            Select coach:
          </label>

          <select
            className="form-select rounded-xl h-[58px] border-gray-200"
            {...register("coach")}
          >
            <option key={1} value="">
              Select a Coach
            </option>
            {coachesData.data?.map((coach: any) => (
              <option key={coach?._id} value={coach?._id}>
                {coach?.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <Button outlined onClick={closePopup}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </ModalLayout>
  );
};

export default AddingTraineeModal;
