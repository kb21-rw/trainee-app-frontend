import {
  ApplicantDetails,
  ApplicationForm,
  ApplicationFormStatus,
  QuestionType,
  UserRole,
} from "./types";
import { Cohort } from "./types";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { UserState } from "../features/user/userSlice";

/**
 * extend dayjs to use necessary plugins
 */

dayjs.extend(isBetween);
dayjs.extend(advancedFormat);

/**
 * Structures an array of data into a two-dimensional array containing information for each coach.
 *
 * @param {Array<Array<string>>} data - The input data in a two-dimensional array format.
 * @returns {Array<Array<string>>} - A two-dimensional array with coach information, each containing:
 *   - The coach's id
 *   - The coach's name
 *   - The coach's email
 *   - The coach's role
 */

export const getCoaches = (
  data: any[],
  dataItems: string[],
  currentUser: UserState,
): Array<Array<string>> => {
  const currentUserName = currentUser.name;
  const filteredCoachesData = data?.filter(
    (coachData) => coachData.name !== currentUserName,
  );

  const coachesData = filteredCoachesData?.map(
    (coachData: any) =>
      dataItems?.map((dataItem: string) => coachData[dataItem]),
  );

  return coachesData;
};

/**
 * getTraineesForCoach structures an array of data into a two-dimensional array containing information for each coach.
 *
 * @param {Array<Array<string>>} data - The input data in a two-dimensional array format.
 * @returns {Array<Array<string>>} - A two-dimensional array with coach information, each containing:
 *   - The trainee's id
 *   - The trainee's name
 *   - The trainee's email
 *   - The trainee's coach
 */
export const getTraineesForCoach = (data: any, dataItems: string[]) => {
  const traineesData = data?.map(
    (traineeData: any) =>
      dataItems?.map((dataItem: string) =>
        dataItem === "coach"
          ? traineeData?.coach?.name
          : dataItem === "coachId"
          ? traineeData?.coach?._id
          : traineeData[dataItem],
      ),
  );
  return traineesData;
};
/**
 * getTrainees structures an array of data into a two-dimensional array containing information for each coach.
 *
 * @param {Array<Array<string>>} data - The input data in a two-dimensional array format.
 * @returns {Array<Array<string>>} - A two-dimensional array with coach information, each containing:
 *   - The trainee's id
 *   - The trainee's name
 *   - The trainee's email
 *   - The trainee's coach
 */

export const getTrainees = (data: any, dataItems: string[]) => {
  const traineesData = data?.map(
    (traineeData: any) =>
      dataItems?.map((dataItem: string) =>
        dataItem === "coach"
          ? traineeData?.coach?.name || "No coach assigned"
          : dataItem === "coachId"
          ? traineeData?.coach?._id || ""
          : traineeData[dataItem],
      ),
  );
  return traineesData;
};

export const getApplicants = (
  data: ApplicantDetails[],
  dataItems: string[],
) => {
  return data?.map((item: any) =>
    dataItems.map((key) => item[key as keyof ApplicantDetails]),
  );
};

/**
 * Retrieves specific data items from each cohort in the provided data array.
 *
 * @param {Cohort[]} data - An array of cohort objects. Each object represents a cohort and contains various properties.
 * @param {string[]} dataItems - An array of strings representing the keys of the properties you want to extract from each cohort object.
 *
 * @returns {Array<Array<any>>} - A two-dimensional array where each inner array contains the values corresponding to the keys specified in `dataItems` for each cohort object in `data`.
 *
 */

export const getCohorts = (data: Cohort[], dataItems: string[]) => {
  return data?.map((item: any) =>
    dataItems.map((key) => item[key as keyof Cohort]),
  );
};

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
  application?: ApplicationForm,
): ApplicationFormStatus => {
  if (!application) return ApplicationFormStatus.NoApplication;

  const today = dayjs();
  const endDate = dayjs(application.endDate);
  const tenDaysAfterDeadline = endDate.add(10, "days");

  if (today.isAfter(endDate)) {
    if (today.isAfter(tenDaysAfterDeadline))
      return ApplicationFormStatus.NoApplication;

    return ApplicationFormStatus.DeadlinePassed;
  }

  const someQuestionsAreAnswered = application.questions.some(
    (question) => question.response !== null,
  );

  if (someQuestionsAreAnswered) return ApplicationFormStatus.Saved;

  return ApplicationFormStatus.Open;
};

/**
 * getErrorInfo extracts error details
 *
 * @param {any} error
 * @returns {{type: string, message: string}}
 *   - type
 *   - message
 */

export const getErrorInfo = (error: any): { type: string; message: string } => {
  console.log(error);
  if (!error?.data) {
    throw { type: error.status, message: error.error.split(":")[1] };
  }

  if (error?.data?.type === "ServerError") {
    throw { type: "ServerError", message: error.data.errorMessage };
  }

  return {
    type: error.data?.type || "Unknown",
    message: error.data?.errorMessage || "Unknown error occurred!",
  };
};

/**
 * getRoleBasedHomepageURL returns a homepage url based on role provided
 *
 * @param {UserRole} role
 * a role of a user
 */

export const getRoleBasedHomepageURL = (role: UserRole) => {
  switch (role) {
    case UserRole.Admin:
      return "/users";
    case UserRole.Coach:
      return "/overview";
    default:
      return "/home";
  }
};

/**
 * getFormattedDate returns a DD MMMM YYYY formatted date
 *
 * @param {string} date
 * a string date
 */

export const getFormattedDate = (date: string) => {
  return dayjs(date).format("DD MMMM YYYY");
};

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
  );
};
