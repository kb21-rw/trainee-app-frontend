import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useGetMyApplicationQuery } from "../../features/user/backendApi";
import Loader from "../../components/ui/Loader";
import {
  ApplicationFormResponse,
  Cookie,
  Question,
  QuestionType,
} from "../../utils/types";
import { useCookies } from "react-cookie";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import Button from "../../components/ui/Button";

const ApplicationForm = () => {
  const location = useLocation();
  const [cookies] = useCookies([Cookie.jwt]);
  const [formData] = useState(location?.state || {});
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm({
    defaultValues: formData,
  });

  const { data, isFetching } = useGetMyApplicationQuery(cookies.jwt);

  const formTitle = data?.name;
  const formQuestions = data?.questions ?? [];

  console.log(formQuestions)

  const handleFormSubmit = (formData: any) => {
    console.log("Clicked!!");
    const responses = formData.responses.map(
      (response: ApplicationFormResponse) => ({
        questionId: response.questionId,
        answer: response.answer ? response.answer : [response.answer],
      })
    );

    navigate("/preview", {
      state: { formQuestions, responses, formTitle, formData },
    });
  };

  if (isFetching)
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="py-12">
      <>
        <div className="border-t-primary-dark border-t-8 rounded-xl p-2 sm:p-4 w-full"></div>
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

          {formQuestions.map((question: Question) => (
            <Box key={question._id} sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                component="label"
                sx={{ display: "block" }}
              >
                {question.prompt}
              </Typography>

              {question.type === QuestionType.Text && (
                <Controller
                  name={`responses[${question._id}].answer`}
                  control={control}
                  defaultValue=""
                  rules={{ required: question.required }}
                  render={({ field }) => (
                    <TextField {...field} fullWidth variant="standard" />
                  )}
                />
              )}

              {question.type === QuestionType.SingleSelect && (
                <Controller
                  name={`responses[${question._id}].answer`}
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
                        )
                      )}
                    </RadioGroup>
                  )}
                />
              )}

              {question.type === QuestionType.MultiSelect && (
                <Controller
                  name={`responses[${question._id}].answer`}
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
                                        (item: string) => item !== option
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            }
                            label={option}
                          />
                        )
                      )}
                    </FormGroup>
                  )}
                />
              )}

              <Controller
                name={`responses[${question._id}].questionId`}
                control={control}
                defaultValue={question._id}
                render={({ field }) => <input type="hidden" {...field} />}
              />
            </Box>
          ))}

          <Box
            sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 2 }}
          >
            <Button outlined>Save Draft</Button>
            <Button type="submit">Review and Submit</Button>
          </Box>
        </Box>
      </>
    </div>
  );
};

export default ApplicationForm;
