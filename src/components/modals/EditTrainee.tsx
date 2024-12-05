import React from "react";
import {
  useEditTraineeMutation,
  useGetCoachesQuery,
} from "../../features/user/backendApi";
import { useForm } from "react-hook-form";
import ModalLayout from "./ModalLayout";
import InputField from "../ui/InputField";
import Button from "../ui/Button";
import Loader from "../ui/Loader";
import { AlertType, UserRole } from "../../utils/types";
import { getErrorInfo } from "../../utils/helper";
import { handleShowAlert } from "../../utils/handleShowAlert";
import { useDispatch } from "react-redux";

const EditTraineeModal = ({
  closePopup,
  jwt,
  traineeData,
  role,
}: {
  closePopup: () => void;
  jwt: string;
  traineeData: string[];
  role: UserRole.Admin;
}) => {
  const [editTrainee, { isLoading, error, isSuccess: isEditTraineeSuccess }] =
    useEditTraineeMutation();
  const query = "?coachesPerPage=100";
  const allCoaches = useGetCoachesQuery(
    { jwt, query },
    { skip: role !== UserRole.Admin }
  );
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const onSubmit = async (data: any) => {
    await editTrainee({ jwt, id: traineeData[0], body: { ...data } });
  };

  if (error) {
    const { message } = getErrorInfo(error);
    handleShowAlert(dispatch, {
      type: AlertType.Error,
      message,
    });
  }

  if (isEditTraineeSuccess) {
    handleShowAlert(dispatch, {
      type: AlertType.Success,
      message: "Trainee was updated successfully",
    });
  }

  return (
    <ModalLayout closePopup={closePopup} title="Edit trainee">
      {isLoading && (
        <div className="w-full flex justify-center items-center">
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
          defaultValue={traineeData[1]}
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
          defaultValue={traineeData[2]}
          register={register}
          options={{
            required: { value: true, message: "Email is required field" },
          }}
        />
        {role === UserRole.Admin && (
          <div className="flex flex-col gap-5">
            <label htmlFor="role" className="text-lg font-medium">
              Assign coach
            </label>

            <select
              className="form-select rounded-xl h-[58px] border-gray-200"
              {...register("coach")}
            >
              {allCoaches.data?.map((coach: any, index: number) => (
                <option
                  key={index}
                  value={coach._id}
                  selected={coach.name === traineeData[3]}
                >
                  {coach.name}
                </option>
              ))}
            </select>
          </div>
        )}
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

export default EditTraineeModal;
