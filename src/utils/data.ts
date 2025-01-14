import { ApplicationFormStatus, FormType, MenuItemType } from "./types"

export const adminMenu = [
  { link: "/users", title: "Users" },
  { link: "/applicants", title: "Applicants" },
  { link: "/trainees", title: "Trainees" },
  { link: "/coaches", title: "Coaches" },
  { link: "/forms", title: "Forms" },
  { link: "/cohorts", title: "Cohorts" },
]
export const coachMenu = [
  { link: "/overview", title: "Overview" },
  { link: "/trainees-results", title: "Trainee Results" },
  { link: "/my-trainees", title: "My trainees" },
]

export const applicantMenu = [{ link: "/home", title: "Home" }]

export const menuItems: MenuItemType[] = [
  { label: "Create a new form for Trainees", type: FormType.Trainee },
  { label: "Create a new form for Applicants", type: FormType.Applicant },
  {
    label: "Create a new Application form",
    link: "/forms/create/application-form",
  },
]

export const usersPerPageValues = [10, 20, 30, 40, 50, 100]
export const cohortsPerPage = [10, 20, 30, 40, 50, 100]
export const applicantsPerPage = [3, 5, 10, 20, 30, 40, 50, 100]
export const coachTableSortingValues = [
  { title: "Entry", value: "entry" },
  { title: "Name", value: "name" },
  { title: "Role", value: "role" },
]
export const coachTableHeaders = ["No", "Name", "Email", "Role", "Action"]
export const coachTableDataItems = ["_id", "name", "email", "role"]
export const traineeTableSortingValues = [
  { title: "Entry", value: "entry" },
  { title: "Name", value: "name" },
]

export const cohortTableSortingValues = [
  { title: "Entry", value: "entry" },
  { title: "Name", value: "name" },
]

export const applicantTableSortingValues = [
  { title: "Entry", value: "entry" },
  { title: "Name", value: "name" },
  { title: "Email", value: "email" },
]

export const cohortTableHeaders = [
  "No",
  "Cohort Name",
  "Stages",
  "Applicants",
  "Trainees",
  "Dropped",
  "Action",
]
export const cohortTableDataItems = [
  "_id",
  "name",
  "stages",
  "applicants",
  "trainees",
  "rejected",
]
export const applicantTableHeaders = [
  "No",
  "Applicant Number",
  "Applicant Name",
  "Email",
  "Response",
  "Action",
]
export const applicantTableDataItems = ["_id", "userId", "name", "email"]
export const traineeTableHeaders = ["No", "Name", "Email", "Coach", "Action"]
export const editTraineeTableHeaders = ["No", "Name", "Email", ""]
export const editTraineeTableItems = ["_id", "name", "email"]
export const traineeTableDataItems = ["_id", "name", "email", "coach"]

export const applicationFormStatusData = {
  [ApplicationFormStatus.Open]: {
    heading: "Welcome to The GYM's Application Portal",
    description:
      "The Gym is currently accepting applications for the software developer trainee program. Click on the button below to apply.",
    buttonText: "Apply now",
    buttonLink: "/apply",
    programBenefits: [
      {
        title: "Hands-On Projects",
        description: "Work on real-world projects to build your portfolio.",
      },
      {
        title: "Expert Instructors",
        description:
          "Learn from industry professionals with years of experience.",
      },
      {
        title: "Career Support",
        description:
          "Get assistance with job placement, resume building, and interview preparation.",
      },
    ],
  },
  [ApplicationFormStatus.NoApplication]: {
    heading: "Application is not open yet!",
    description:
      "Dear applicant, there is no open application at the moment, click on the button below to join our waiting list to be notified when the next application opens.",
    buttonText: "Join waiting list",
    buttonLink: "/",
  },
  [ApplicationFormStatus.DeadlinePassed]: {
    heading: "Application deadline passed",
    description:
      "Dear applicant, the application deadline has passed, click on the button below to join our waiting list to be notified when the next application opens.",
    buttonText: "Join waiting list",
    buttonLink: "/",
  },
  [ApplicationFormStatus.Submitted]: {
    heading: "Application Submitted 🎉",
    description:
      "Your application has been submitted, we will review it and get back to you soon via email. Thanks for applying!",
    buttonText: "View your submitted application",
    buttonLink: "/saved-application",
  },
  [ApplicationFormStatus.Saved]: {
    heading: "You have a saved application!",
    description:
      "You have a saved application that you can still edit and submit before the deadline. Don't forget to review and submit it on time!",
    buttonText: "Continue your application",
    buttonLink: "/apply",
  },
}

export const customizeDataGridStyles = {
  border: "none",
  "& .MuiDataGrid-row": {
    borderBottom: "1px solid #000000",
  },
  "& .MuiDataGrid-columnHeader": {
    backgroundColor: "#CCE4F0",
    fontWeight: "bold",
    fontSize: "18px",
    border: "none",
  },
  "& .MuiDataGrid-columnSeparator": {
    display: "none",
  },
  "& .MuiDataGrid-cell:focus": {
    outline: "none",
  },
}
