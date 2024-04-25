import React from "react";
import ModalLayout from "./ModalLayout";
import Button from "../ui/Button";
import { useForm } from "react-hook-form";
import Alert from "../ui/Alert";
import TextArea from "../ui/TextArea";
import Cookies from "universal-cookie";
import { useAddResponseMutation } from "../../features/user/apiSlice";
import Loader from "../ui/Loader";

const ResponseModal = ({
  closePopup,
  title,
  question,
  questionId,
  userId,
  response,
  includeButton,
}: {
  closePopup: () => void;
  title: string;
  question: string;
  questionId: string;
  userId: string;
  response?: string;
  includeButton?: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const cookies = new Cookies();
  const jwt = cookies.get("jwt");
  const [addResponse, {isLoading, error, isSuccess}] = useAddResponseMutation();


  const onSubmit = async (data: any) => {
    await addResponse({ jwt, body: { ...data }, questionId, userId });
  };

  const errorMessage: any = errors.name?.message || errors.email?.message || error?.data?.errorMessage;

  return (
    <ModalLayout closePopup={closePopup} title={title}>
      {isLoading && (
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      )}
      {errorMessage && <Alert type="error">{errorMessage}</Alert>}
      {isSuccess && (
        <Alert type="success">Response was added succesfully</Alert>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-12 w-full"
      >
        <TextArea
          label={question}
          placeholder={response || "No response"}
          name="text"
          register={register}
          defaultValue={response}
          options={{
            required: { value: true, message: "response is required" },
            maxLength: {
              value: 30,
              message: "Add your response here",
            },
          }}
        />
        <div className="flex justify-end">
          {includeButton && <Button>Save Response</Button>}
        </div>
      </form>
    </ModalLayout>
  );
};

export default ResponseModal;
