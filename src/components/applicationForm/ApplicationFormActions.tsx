import React from "react"
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
          <div className="my-10 flex items-center justify-center">
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
          <div className="text-center flex items-center flex-col">
            <h1 className="text-2xl font-medium text-gray-600 text-center">
              {statusBasedData.heading}
            </h1>
          </div>
          <div className="max-w-2xl mx-auto flex flex-col items-center justify-center border border-gray-300 rounded-lg p-6 shadow-lg space-y-4">
            <p className="text-center text-gray-500">
              {statusBasedData.description}
            </p>

            <Link
              className="bg-primary-dark text-white px-6 py-3 rounded-md"
              to={statusBasedData.buttonLink}
            >
              {statusBasedData.buttonText}
            </Link>

            <div className="text-gray-600 text-sm text-center">
              Learn more about The Gym software developer trainee program{" "}
              <Link
                to="https://www.the-gym.rw/"
                className="text-blue-600 underline"
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
