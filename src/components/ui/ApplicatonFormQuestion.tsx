import { Control, Controller } from "react-hook-form";
import { QuestionType } from "../../utils/types";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";

interface ApplicationDFormQuestionProps {
  question: {
    _id: string;
    prompt: string;
    required: boolean;
    response: null | string;
    type: QuestionType;
    options: string[];
  };
  control: Control<any, any>;
}

export default function ApplicationFormQuestion({
  question,
  control,
}: ApplicationDFormQuestionProps) {
  return (
    <>
      {question.type === QuestionType.MultiSelect && (
        <Controller
          name={question._id}
          control={control}
          defaultValue={question.response ?? []}
          rules={{ required: question.required }}
          render={({ field }) => (
            <FormGroup id={question._id}>
              {question.options?.map((option: string, optionIndex: number) => (
                <FormControlLabel
                  key={optionIndex}
                  control={
                    <Checkbox
                      checked={field.value.includes(option)}
                      onChange={(e) => {
                        const newValues = e.target.checked
                          ? [...field.value, option]
                          : field.value.filter(
                              (item: string) => item !== option
                            );
                        field.onChange(newValues);
                      }}
                    />
                  }
                  label={option}
                />
              ))}
            </FormGroup>
          )}
        />
      )}
      {question.type === QuestionType.SingleSelect && (
        <Controller
          name={question._id}
          control={control}
          defaultValue={question.response ?? null}
          rules={{ required: question.required }}
          render={({ field }) => (
            <RadioGroup {...field} id={question._id}>
              {question.options?.map((option: string, index: number) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          )}
        />
      )}
      {question.type === QuestionType.Text && (
        <Controller
          name={question._id}
          control={control}
          defaultValue={question.response ?? []}
          rules={{ required: question.required }}
          render={({ field }) => (
            <TextField
              {...field}
              id={question._id}
              fullWidth
              variant="standard"
              // error={Boolean(errors[question._id])}
            />
          )}
        />
      )}
      {/* <Controller
        name={question._id}
        control={control}
        defaultValue={question.response ?? ""}
        // rules={{ required: question.required }}
        render={({ field }) => {
          switch (question.type) {
            case QuestionType.MultiSelect:
              return (
                <FormGroup id={question._id}>
                  {question.options?.map(
                    (option: string, optionIndex: number) => (
                      <FormControlLabel
                        key={optionIndex}
                        control={
                          <Checkbox
                            checked={field.value.includes(option)}
                            onChange={(e) => {
                              const newValues = e.target.checked
                                ? [...field.value, option]
                                : field.value.filter(
                                    (item: string) => item !== option
                                  );
                              field.onChange(newValues);
                            }}
                          />
                        }
                        label={option}
                      />
                    )
                  )}
                </FormGroup>
              );

            case QuestionType.SingleSelect:
              return (
                <RadioGroup {...field} id={question._id}>
                  {question.options?.map((option: string, index: number) => (
                    <FormControlLabel
                      key={index}
                      value={option}
                      control={<Radio />}
                      label={option}
                    />
                  ))}
                </RadioGroup>
              );

            default:
              return (
                <TextField
                  {...field}
                  id={question._id}
                  fullWidth
                  variant="standard"
                  // error={Boolean(errors[question._id])}
                />
              );
          }
        }}
      /> */}
    </>
  );
}
