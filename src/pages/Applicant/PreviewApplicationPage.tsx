import { useLocation, useNavigate } from "react-router-dom";
import { useAddApplicantResponseMutation } from "../../features/user/backendApi";
import { getJWT } from "../../utils/helper";
import { Question, QuestionType } from "../../utils/types";
import Button from "../../components/ui/Button";
import {
  TextField,
  Checkbox,
  Radio,
  FormControlLabel,
  RadioGroup,
  FormGroup,
} from "@mui/material";
import Alert from "../../components/ui/Alert";
import { useEffect } from "react";

const PreviewApplicationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formQuestions, responses, formData, formTitle } =
    location.state || {};
  const [addApplicantResponse, { isSuccess, error }] =
    useAddApplicantResponseMutation();

    useEffect(() => {
      if (isSuccess) {
        const timer = setTimeout(() => {
          window.location.href = "/home";
        }, 3000);
    
        return () => clearTimeout(timer);
      }
    }, [isSuccess]);

  const handleConfirm = async () => {
    try {
      const jwt = getJWT();
      await addApplicantResponse({ jwt, body: responses, action: "submit" });
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  const backToEdit = () => {
    navigate("/apply", { state: formData });
  };

  const errorMessage = error ? error.data.errorMessage : null;

  return (
    <div className="md:flex items-center justify-center py-5">
      {isSuccess && (
        <Alert type="success">
          Successfully Applied, Redirecting to home page...
        </Alert>
      )}
      {errorMessage && <Alert type="error">{errorMessage}</Alert>}
      <div className="flex flex-col items-center justify-center p-5 custom-shadow border-t-[#673AB7] border-t-8 rounded-xl w-full md:w-2/5">
        <div className="p-4">
          <h1 className="font-bold text-xl">{formTitle}</h1>
        </div>
        <div className="mb-8 p-4 rounded-t-xl md:w-4/5 w-full">
          {formQuestions?.map((question: Question, index: number) => (
            <div key={index} className="mb-6">
              <h3 className="text-md font-semibold text-gray-600 mb-2">
                {index + 1}. {question.prompt}
              </h3>
              {question.type === QuestionType.Text && (
                <TextField
                  fullWidth
                  variant="standard"
                  value={responses[index]?.answer}
                  disabled
                />
              )}
              {question.type === QuestionType.SingleSelect && (
                <RadioGroup
                  value={responses[index]?.answer}
                  name={`question-${index}`}
                >
                  {question.options?.map(
                    (option: string, optionIndex: number) => (
                      <FormControlLabel
                        key={optionIndex}
                        value={option}
                        control={<Radio disabled />}
                        label={option}
                        disabled
                      />
                    ),
                  )}
                </RadioGroup>
              )}
              {question.type === QuestionType.MultiSelect && (
                <FormGroup>
                  {question.options?.map(
                    (option: string, optionIndex: number) => (
                      <FormControlLabel
                        key={optionIndex}
                        control={
                          <Checkbox
                            checked={responses[index]?.answer.includes(option)}
                            disabled
                          />
                        }
                        label={option}
                        disabled
                      />
                    ),
                  )}
                </FormGroup>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-4">
          <Button outlined onClick={backToEdit}>
            <span className="flex items-center space-x-2">Back to edit</span>
          </Button>
          <Button onClick={handleConfirm}>
            <span className="flex items-center space-x-2">
              Submit Application
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreviewApplicationPage;
