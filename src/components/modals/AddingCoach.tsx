import React from "react";
import ModalLayout from "./ModalLayout";
import InputField from "../ui/InputField";
import Button from "../ui/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import { useCreateCoachMutation } from "../../features/user/backendApi";
import Loader from "../ui/Loader";
import { CreateCoach, UserRole } from "../../utils/types";
import useAutoCloseModal from "../../utils/hooks/useAutoCloseModal";
import { useDispatch } from "react-redux";
import { showAlert } from "../../features/user/alertSlice";
const AddingCoachModal = ({
  closePopup,
  jwt,
}: {
  closePopup: () => void;
  jwt: string;
}) => {
  const dispatch = useDispatch();
  const [createCoach, { isLoading, error, isSuccess }] =
    useCreateCoachMutation();
  const { register, handleSubmit } = useForm<CreateCoach>();

  const onSubmit: SubmitHandler<CreateCoach> = async (data) => {
    try {
      const result = await createCoach({
        jwt,
        body: { ...data, role: UserRole.Coach },
      }).unwrap();

      if (result?.error) {
        dispatch(
          showAlert({
            message: result.error.data.errorMessage,
            type: "error",
            displayDuration: 5000,
          })
        );
        return;
      }
    } catch (error) {
      return "false";
    }
  };

  if (error) {
    throw error;
  }

  useAutoCloseModal(isSuccess, closePopup);

  if (isSuccess) {
    dispatch(
      showAlert({
        message: "Coach was added successfully",
        type: "error",
        displayDuration: 5000,
      })
    );
  }

  return (
    <ModalLayout closePopup={closePopup} title="Add coach">
      {isLoading && (
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-8 w-full"
      >
        <InputField
          type="text"
          label="Name"
          placeholder="Coach name"
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
          label="Email address"
          placeholder="example@mail.com"
          name="email"
          register={register}
          options={{
            required: { value: true, message: "email is required field" },
          }}
        />
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

export default AddingCoachModal;
