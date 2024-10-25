/* eslint-disable no-unused-vars */

import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  TextField,
  Radio,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  FormGroup,
  Typography,
  Box,
} from "@mui/material";
import { Question, QuestionType } from "../../utils/types";
import Button from "./Button";

interface FormComponentProps {
  formTitle: string;
  formQuestions: Question[];
  initialFormData?: any;
  handleFormSubmit: (formData: any) => void;
}

const FormComponent: React.FC<FormComponentProps> = ({
  formTitle,
  formQuestions,
  initialFormData,
  handleFormSubmit,
}) => {
  const { handleSubmit, control, setValue } = useForm({
    defaultValues: initialFormData,
  });

  useEffect(() => {
    if (initialFormData) {
      Object.keys(initialFormData).forEach((key) => {
        setValue(key, initialFormData[key]);
      });
    }
  }, [initialFormData, setValue]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      sx={{
        p: 2,
        bgcolor: "background.paper",
        borderRadius: 2,
        maxWidth: "3xl",
        mx: "auto",
      }}
    >
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          pb: { xs: 2, md: 4 },
          mb: { xs: 2, md: 4 },
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          fontWeight="bold"
          sx={{
            fontSize: { xs: "1.5rem", md: "2rem" },
            lineHeight: { xs: "1.8rem", md: "2.4rem" },
          }}
        >
          {formTitle}
        </Typography>
      </Box>

      {formQuestions.map((question: Question, index: number) => (
        <Box key={index} sx={{ mb: 4 }}>
          <Typography variant="h6" component="label" sx={{ display: "block" }}>
            {index + 1}. {question.prompt}
          </Typography>

          {question.type === QuestionType.Text && (
            <Controller
              name={`responses[${index}].answer`}
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <TextField {...field} fullWidth variant="standard" />
              )}
            />
          )}

          {question.type === QuestionType.SingleSelect && (
            <Controller
              name={`responses[${index}].answer`}
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <RadioGroup {...field}>
                  {question.options?.map(
                    (option: string, optionIndex: number) => (
                      <FormControlLabel
                        key={optionIndex}
                        value={option}
                        control={<Radio />}
                        label={option}
                      />
                    ),
                  )}
                </RadioGroup>
              )}
            />
          )}

          {question.type === QuestionType.MultiSelect && (
            <Controller
              name={`responses[${index}].answer`}
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <FormGroup>
                  {question.options?.map(
                    (option: string, optionIndex: number) => (
                      <FormControlLabel
                        key={optionIndex}
                        control={
                          <Checkbox
                            checked={field.value.includes(option)}
                            onChange={(e) => {
                              const newValue = e.target.checked
                                ? [...field.value, option]
                                : field.value.filter(
                                    (item: string) => item !== option,
                                  );
                              field.onChange(newValue);
                            }}
                          />
                        }
                        label={option}
                      />
                    ),
                  )}
                </FormGroup>
              )}
            />
          )}

          <Controller
            name={`responses[${index}].questionId`}
            control={control}
            defaultValue={question._id}
            render={({ field }) => <input type="hidden" {...field} />}
          />
        </Box>
      ))}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 2 }}>
        <Button outlined>Save Draft</Button>
        <Button type="submit">Review and Submit</Button>
      </Box>
    </Box>
  );
};

export default FormComponent;
