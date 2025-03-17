import { Link } from "react-router-dom"
import {
  ApplicationForm,
  ApplicationFormStatus,
  ButtonSize,
  UserResponseQuestion,
  UserRole,
} from "../../utils/types"
import { getApplicationFormStatus, getFormattedDate } from "../../utils/helper"
import { applicationFormStatusData } from "../../utils/data"
import CohortInfo from "../ui/CohortInfo"
import Button from "../ui/Button"

interface ApplicationFormActionsProps {
  applicationForm: Omit<ApplicationForm, "questions"> & {
    questions: UserResponseQuestion[]
    trainingStartDate: string
  }
  role: UserRole
}

export default function ApplicationFormActions({
  applicationForm,
  role,
}: ApplicationFormActionsProps) {
  const status =
    role === UserRole.Applicant
      ? ApplicationFormStatus.Submitted
      : getApplicationFormStatus(applicationForm)

  const statusBasedData = applicationFormStatusData[status]

  return (
    <>
      {status === ApplicationFormStatus.Open && (
        <>
          <CohortInfo
            cohortTitle={applicationForm.name}
            applicationDeadline={getFormattedDate(applicationForm.endDate)}
            trainingStartDate={getFormattedDate(
              applicationForm.trainingStartDate,
            )}
            programBenefits={
              applicationFormStatusData[ApplicationFormStatus.Open]
                .programBenefits
            }
          />
          <div className="flex items-center justify-center my-10">
            <div>
              <Button size={ButtonSize.Large}>
                <Link to="/apply">Apply now</Link>
              </Button>
            </div>
          </div>
        </>
      )}
      {status !== ApplicationFormStatus.Open && (
        <>
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-medium text-center text-gray-600">
              {statusBasedData.heading}
            </h1>
          </div>
          <div className="flex flex-col items-center justify-center max-w-2xl p-6 mx-auto space-y-4 border border-gray-300 rounded-lg shadow-lg">
            <p className="text-center text-gray-500">
              {statusBasedData.description}
            </p>

            <Link
              className="px-6 py-3 text-white rounded-md bg-primary-dark"
              to={statusBasedData.buttonLink}
            >
              {statusBasedData.buttonText}
            </Link>

            <div className="text-sm text-center text-gray-600">
              Learn more about The Gym software developer trainee program{" "}
              <Link
                to="https://www.the-gym.rw/"
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </Link>
              .
            </div>
          </div>
        </>
      )}
    </>
  )
}
