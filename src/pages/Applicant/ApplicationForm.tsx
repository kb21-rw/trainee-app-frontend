import { useLocation, useNavigate } from "react-router-dom";
import {
  useAddApplicantResponseMutation,
  useGetMyApplicationQuery,
} from "../../features/user/backendApi";
import Loader from "../../components/ui/Loader";
import { AlertType, Cookie, QuestionType } from "../../utils/types";
import { useCookies } from "react-cookie";
import { Box, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import Button from "../../components/ui/Button";
import {
  convertFormQuestionsToObject,
  getErrorInfo,
  getFormattedDate,
} from "../../utils/helper";
import { handleShowAlert } from "../../utils/handleShowAlert";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import ApplicationFormQuestion from "../../components/ui/ApplicatonFormQuestion";

const ApplicationForm = () => {
  const location = useLocation();
  const [cookies] = useCookies([Cookie.jwt]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, isFetching } = useGetMyApplicationQuery(cookies.jwt);
  const [saveApplicantResponse, { error }] = useAddApplicantResponseMutation();
  const {
    handleSubmit,
    getValues,
    control,
    reset,
    formState: { isDirty, errors, dirtyFields },
  } = useForm({
    values: location?.state,
  });

  const formTitle = data?.name;
  const formDeadline = data?.endDate;
  const formQuestions = data?.questions ?? [];

  const handleFormSubmit = (formData: { [key: string]: string | string[] }) => {
    const responses = Object.entries(formData).map(
      (response: [string, string | string[]]) => ({
        questionId: response[0],
        answer: response[1],
      }),
    );

    const QuestionsPreview = formQuestions.map((question: any) => ({
      ...question,
      response: formData[question._id],
    }));
    navigate("/preview", {
      state: {
        formPreview: { ...data, questions: QuestionsPreview },
        responses,
        formData,
      },
    });
  };

  const handleSave = async () => {
    const userResponses = Object.entries(
      getValues() as { [key: string]: string | string[] },
    );

    const modifiedResponses = userResponses.filter(
      (response: [string, string | string[]]) => dirtyFields[response[0]],
    );
    const responses = modifiedResponses.map(
      (response: [string, string | string[]]) => ({
        questionId: response[0],
        answer: response[1],
      }),
    );

    const result = await saveApplicantResponse({
      jwt: cookies.jwt,
      body: responses,
      action: "save",
    });

    const formQuestions = convertFormQuestionsToObject(result.data.questions);
    reset(formQuestions, { keepDirty: false });

    handleShowAlert(dispatch, {
      type: AlertType.Success,
      message: "Successfully saved your progress",
    });
  };

  useEffect(() => {
    if(location?.state) return
    if (data) {
      const formQuestions = convertFormQuestionsToObject(data.questions);
      reset(formQuestions, { keepDirty: false });
    }
  }, [reset, data, location?.state]);

  if (error) {
    const { message } = getErrorInfo(error);
    handleShowAlert(dispatch, { type: AlertType.Error, message });
  }

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
                  htmlFor={question._id}
                  sx={{
                    display: "block",
                    color: errors[question._id] ? "#f87171" : "inherit",
                  }}
                >
                  {question.prompt}
                  {question.required && <span className="text-red-400">*</span>}
                </Typography>

                <ApplicationFormQuestion
                  question={question}
                  control={control}
                />
              </Box>
            ),
          )}

          <Box
            sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 2 }}
          >
            <Button outlined onClick={handleSave} disabled={!isDirty}>
              Save Draft
            </Button>
            <Button type="submit">Review and Submit</Button>
          </Box>
        </Box>
      </>
    </div>
  );
};

export default ApplicationForm;
