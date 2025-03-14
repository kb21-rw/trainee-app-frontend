/* eslint-disable @typescript-eslint/no-explicit-any */
import { handleShowAlert } from "./handleShowAlert"
import {
  AlertType,
  ApplicationForm,
  ApplicationFormStatus,
  FormType,
  OnCreateFormSubmitParams,
  QuestionType,
  UserResponseQuestion,
  UserRole,
} from "./types"
import dayjs from "dayjs"

/**
 * Handles the submission of the create form
 *
 * @param {OnCreateFormSubmitParams} params - All required parameters for form creation
 * @returns {Promise<void>}
 */
export const onCreateFormSubmit = async ({
  data,
  formType,
  cookies,
  createForm,
  reset,
  navigate,
  dispatch,
  onClose,
}: OnCreateFormSubmitParams): Promise<void> => {
  const requestBody: {
    name: string
    type: FormType
    description?: string
    startDate?: string
    endDate?: string
    stages?: { name: string }[]
  } = {
    name: data.title,
    type: formType,
  }

  if (data.description) {
    requestBody.description = data.description
  }

  if (formType === FormType.Application) {
    const now = new Date()
    requestBody.startDate = new Date(
      now.getTime() + 24 * 60 * 60 * 1000,
    ).toISOString()
    requestBody.endDate = new Date(
      now.getTime() + 48 * 60 * 60 * 1000,
    ).toISOString()
    requestBody.stages = [{ name: "Application" }]
  }

  try {
    const result = await createForm({
      jwt: cookies.jwt,
      body: requestBody,
    }).unwrap()
    reset()
    navigate(`/forms/${result._id}?edit=true`)
  } catch (error) {
    const { message } = getErrorInfo(error)
    handleShowAlert(dispatch, {
      type: AlertType.Error,
      message,
    })
  } finally {
    onClose()
  }
}

/**
 * Determines the current status of an application based on the provided dates.
 *
 * This function checks whether an application is open, if it's deadline has passed, or if there is no active application.
 * Additionally, it adds a 10-day grace period after the application deadline, during which it indicates that the application
 * deadline has passed but still recognizes the application as recently closed.
 *
 * @param {ApplicationForm | undefined} application
 *
 * @returns {ApplicationFormStatus} application status
 */

export const getApplicationFormStatus = (
  application?: Omit<ApplicationForm, "questions"> & {
    questions: UserResponseQuestion[]
  },
): ApplicationFormStatus => {
  if (!application) return ApplicationFormStatus.NoApplication

  const today = dayjs()
  const endDate = dayjs(application.endDate)
  const startDate = dayjs(application.startDate)
  const tenDaysAfterDeadline = endDate.add(10, "days")

  if (today.isBefore(startDate)) return ApplicationFormStatus.NoApplication

  if (today.isAfter(endDate)) {
    if (today.isAfter(tenDaysAfterDeadline))
      return ApplicationFormStatus.NoApplication

    return ApplicationFormStatus.DeadlinePassed
  }

  const someQuestionsAreAnswered = application.questions.some(
    (question) => question.response !== null,
  )

  if (someQuestionsAreAnswered) return ApplicationFormStatus.Saved

  return ApplicationFormStatus.Open
}

/**
 * getErrorInfo extracts error details
 *
 * @param {any} error
 * @returns {{type: string, message: string}}
 *   - type
 *   - message
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getErrorInfo = (error: any): { type: string; message: string } => {
  // eslint-disable-next-line no-console
  console.log(error)
  if (!error?.data) {
    throw { type: error.status, message: error.error.split(":")[1] }
  }

  if (error?.data?.type === "ServerError") {
    throw { type: "ServerError", message: error.data.errorMessage }
  }

  return {
    type: error.data?.type || "Unknown",
    message: error.data?.errorMessage || "Unknown error occurred!",
  }
}

/**
 * getRoleBasedHomepageURL returns a homepage url based on role provided
 *
 * @param {UserRole} role
 * a role of a user
 */

export const getRoleBasedHomepageURL = (role: UserRole) => {
  switch (role) {
    case UserRole.Admin:
      return "/users"
    case UserRole.Coach:
      return "/overview"
    default:
      return "/home"
  }
}

/**
 * getFormattedDate returns a DD MMMM YYYY formatted date
 *
 * @param {string} date
 * a string date
 */

export const getFormattedDate = (date: string) => {
  return dayjs(date).format("DD MMMM YYYY")
}

/**
 * convertFormQuestionsToObject returns an object where questionIds are keys and responses are values
 *
 * @param {{ _id: string; response: string; type: QuestionType }[]} questions
 * an array of questions
 */

export const convertFormQuestionsToObject = (
  questions: { _id: string; response: string; type: QuestionType }[],
) => {
  return questions.reduce(
    (formQuestions: { [key: string]: string | string[] }, question) => ({
      ...formQuestions,
      [question._id]:
        question.response ??
        (question.type === QuestionType.MultiSelect ? [] : ""),
    }),
    {},
  )
}
