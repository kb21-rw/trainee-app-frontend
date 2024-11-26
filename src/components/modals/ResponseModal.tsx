import { useEffect, useState } from "react";
import ModalLayout from "./ModalLayout";
import Button from "../ui/Button";
import { useForm } from "react-hook-form";
import TextArea from "../ui/TextArea";
import { useAddResponseMutation } from "../../features/user/backendApi";
import Loader from "../ui/Loader";
import RadioOption from "../ui/RadioOption";
import { getErrorInfo } from "../../utils/helper";
import { AlertType, Cookie, QuestionType } from "../../utils/types";
import { handleShowAlert } from "../../utils/handleShowAlert";
import { useDispatch } from "react-redux";
import { useCookies } from "react-cookie";

const ResponseModal = ({
  closePopup,
  title,
  question,
  questionId,
  userId,
  response,
  includeButton,
  disabled,
  questionType,
  options,
  checkedOption,
  handleCheckChange,
}: {
  closePopup: () => void;
  title: string;
  question: string;
  questionId: string;
  userId: string;
  response?: string;
  includeButton?: boolean;
  disabled?: boolean;
  questionType: string;
  options: string[];
  checkedOption: string;
  // eslint-disable-next-line no-unused-vars
  handleCheckChange: (_value: string) => void;
}) => {
  const [cookies] = useCookies([Cookie.jwt]);
  const { register, handleSubmit } = useForm();
  const [addResponse, { isLoading, error, isSuccess }] =
    useAddResponseMutation();
  const dispatch = useDispatch();
  const [localCheckedOption, setLocalCheckedOption] = useState(checkedOption);
  const handleRadioChange = (value: string) => {
    handleCheckChange(value);
  };

  const onSubmit = async (data: any) => {
    const responseBody = {
      ...data,
      ...(questionType === QuestionType.Text && { text: localCheckedOption }),
    };
    await addResponse({ jwt: cookies.jwt, body: responseBody, questionId, userId });
  };

  useEffect(() => {
    setLocalCheckedOption(checkedOption);
  }, [checkedOption]);

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
      message: "Response was added successfully",
    });
  }

  return (
    <ModalLayout closePopup={closePopup} title={title}>
      {isLoading && (
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-12 w-full"
      >
        {questionType === "text" && (
          <TextArea
            label={question}
            placeholder={response || "No response"}
            name="text"
            register={register}
            defaultValue={response}
            options={{
              required: { value: true, message: "response is required" },
              maxLength: {
                message: "Add your response here",
              },
            }}
            disabled={disabled}
          />
        )}
        {questionType === QuestionType.SingleSelect && (
          <div>
            <h1 className="capitalize text-xl pb-5">{question}:</h1>
            {options.map((option, index) => (
              <RadioOption
                key={option}
                option={option}
                id={`option-${index}`}
                value={option}
                checked={option === localCheckedOption}
                onRadioChange={handleRadioChange}
                disabled={disabled}
              />
            ))}
          </div>
        )}
        <div className="flex justify-end">
          {includeButton && <Button type="submit">Save Response</Button>}
        </div>
      </form>
    </ModalLayout>
  );
};

export default ResponseModal;
