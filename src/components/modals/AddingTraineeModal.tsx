import React, { ReactNode } from "react";
import ModalLayout from "./ModalLayout";
import InputField from "../ui/InputField";
import Button from "../ui/Button";
import { useForm } from "react-hook-form";
import {
  useCreateTraineeMutation,
  useGetAllCoachesQuery,
} from "../../features/user/apiSlice";
import Loader from "../ui/Loader";
import Alert from "../ui/Alert";

const AddingTraineeModal = ({
  closePopup,
  jwt,
}: {
  closePopup: () => void;
  jwt: string;
}) => {
  const [createTrainee, { isError, isLoading, error, isSuccess }] =
    useCreateTraineeMutation();
  const coachesData = useGetAllCoachesQuery({ jwt, query: "" });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data: any) => {
    if (!data?.coach) {
      delete data.coach;
    }
    const result = await createTrainee({
      jwt,
      body: { ...data, role: "TRAINEE" },
    });
  };
  let errorMessage: any = errors.name?.message;
  return (
    <ModalLayout closePopup={closePopup} title="Add trainee">
      {isLoading && (
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      )}
      {isError ? (
        <Alert type="error">{error}</Alert>
      ) : (
        errorMessage && <Alert type="error">{errorMessage}</Alert>
      )}
      {isSuccess && <Alert type="success">Trainee was added succesfully</Alert>}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-12 w-full"
      >
        <InputField
          type="text"
          label="Name"
          placeholder="Trainee's name"
          name="name"
          register={register}
          options={{
            required: { value: true, message: "name is required field" },
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
            {coachesData.data?.map((coach: any, index: number) => (
              <option key={coach?._id} value={coach?._id}>
                {coach?.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <Button outlined clickHandler={closePopup}>
            Cancel
          </Button>
          <Button>Save</Button>
        </div>
      </form>
    </ModalLayout>
  );
};

export default AddingTraineeModal;
