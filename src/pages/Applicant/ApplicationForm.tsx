import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetMyApplicationQuery } from "../../features/user/backendApi";
import Loader from "../../components/ui/Loader";
import { Cookie, QuestionType } from "../../utils/types";
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
import { getFormattedDate } from "../../utils/helper";

const ApplicationForm = () => {
  const location = useLocation();
  const [cookies] = useCookies([Cookie.jwt]);
  const [formData] = useState(location?.state || {});
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: formData,
  });

  const { data, isFetching } = useGetMyApplicationQuery(cookies.jwt);

  const formTitle = data?.name;
  const formDeadline = data?.endDate;
  const formQuestions = data?.questions ?? [];

  const handleFormSubmit = (formData: { [key: string]: string | string[] }) => {
    const responses = Object.entries(formData).map(
      (response: [string, string | string[]]) => ({
        questionId: response[0],
        answer: response[1],
      })
    );

    navigate("/preview", {
      state: { formQuestions, responses, formTitle, formDeadline, formData },
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
            maxWidth: "3xl",
            mx: "auto",
          }}
        >
          <Box
            sx={{
              pb: { xs: 2, md: 4 },
              mb: { xs: 2, md: 4 },
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                variant: "h1",
                component: "h1",
                fontWeight: "bold",
                fontSize: "2rem",
                lineHeight: "3rem",
              }}
            >
              {formTitle}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 0.5,
              }}
            >
              <Typography component="p">Application Deadline:</Typography>
              <Typography
                sx={{
                  component: "span",
                  fontWeight: "bold",
                }}
              >
                {getFormattedDate(formDeadline)}
              </Typography>
            </Box>
          </Box>

          {formQuestions.map(
            (question: {
              _id: string;
              prompt: string;
              required: boolean;
              response: null | string;
              type: QuestionType;
              options: string[];
            }) => (
              <Box
                key={question._id}
                sx={{
                  p: 4,
                  mb: 4,
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;",
                  borderRadius: 3,
                }}
              >
                <Typography
                  variant="h6"
                  component="label"
                  sx={{
                    display: "block",
                    color: errors[question._id] ? "#f87171" : "inherit",
                  }}
                >
                  {question.prompt}
                  {question.required && <span className="text-red-400">*</span>}
                </Typography>

                {question.type === QuestionType.Text && (
                  <Controller
                    name={question._id}
                    control={control}
                    defaultValue=""
                    rules={{ required: question.required }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        variant="standard"
                        error={Boolean(errors[question._id])}
                      />
                    )}
                  />
                )}

                {question.type === QuestionType.SingleSelect && (
                  <Controller
                    name={question._id}
                    control={control}
                    defaultValue=""
                    rules={{ required: question.required }}
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
                    name={question._id}
                    control={control}
                    defaultValue={[]}
                    rules={{ required: question.required }}
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

                <div className="">
                  <Controller
                    name={question._id}
                    control={control}
                    defaultValue={question._id}
                    render={({ field }) => <input type="hidden" {...field} />}
                  />
                </div>
              </Box>
            )
          )}

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
