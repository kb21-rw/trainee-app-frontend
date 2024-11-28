import { QuestionType, UserResponseQuestion } from "../../utils/types";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";

interface ApplicationDFormQuestionProps {
  question: UserResponseQuestion;
  index: number;
}

export default function ApplicationFormQuestionPreview({
  question,
  index,
}: ApplicationDFormQuestionProps) {
  return (
    <div className="mb-6">
      <h3 className="text-md font-semibold text-gray-600 mb-2">
        {index}. {question.prompt}
      </h3>
      {question.type === QuestionType.Text && (
        <TextField
          fullWidth
          variant="standard"
          value={question.response}
          disabled
        />
      )}
      {question.type === QuestionType.SingleSelect && (
        <RadioGroup value={question.response}>
          {question.options?.map((option: string, optionIndex: number) => (
            <FormControlLabel
              key={optionIndex}
              value={option}
              control={<Radio disabled />}
              label={option}
              disabled
            />
          ))}
        </RadioGroup>
      )}
      {question.type === QuestionType.MultiSelect && (
        <FormGroup>
          {question.options?.map((option: string) => (
            <FormControlLabel
              key={option}
              control={
                <Checkbox
                  checked={question.response?.includes(option)}
                  disabled
                />
              }
              label={option}
              disabled
            />
          ))}
        </FormGroup>
      )}
    </div>
  );
}
