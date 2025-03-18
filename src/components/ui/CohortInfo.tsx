import React from "react"
import { Link } from "react-router-dom"

interface CohortInfoProps {
  cohortTitle: string
  applicationDeadline: string
  trainingStartDate: string
  programBenefits: {
    title: string
    description: string
  }[]
}

const CohortInfo: React.FC<CohortInfoProps> = ({
  cohortTitle,
  applicationDeadline,
  trainingStartDate,
  programBenefits,
}) => {
  return (
    <>
      <div className="flex flex-col items-center w-full px-4 text-center md:space-y-10 sm:px-0 md:mt-5">
        <p className="flex flex-col mb-4 text-gray-600 sm:mb-8">
          <span>
            Apply for our various training programs and enhance your skills.
          </span>
          <span>Start your journey with us today!</span>
        </p>
      </div>
      <div className="max-w-2xl p-4 mx-auto border border-gray-300 rounded-lg shadow-lg sm:p-6">
        <h1 className="mb-4 text-xl font-bold text-gray-800 sm:text-3xl">
          {cohortTitle}
        </h1>

        <div className="flex items-center justify-between w-full mb-4 sm:w-3/4">
          <p className="font-medium text-gray-600 sm:text-lg">
            Application Deadline:
          </p>
          <p className="font-semibold text-gray-800 underline sm:text-lg">
            {applicationDeadline}
          </p>
        </div>

        <div className="flex items-center justify-between w-full mb-4 sm:w-3/4">
          <p className="font-medium text-gray-600 sm:text-lg">
            Training Start Date:
          </p>
          <p className="font-semibold text-gray-800 underline sm:text-lg">
            {trainingStartDate}
          </p>
        </div>

        <div className="mb-6">
          <p className="font-medium text-gray-800 sm:text-lg">
            What you will gain:
          </p>
          <ul className="mt-2 space-y-2 text-gray-700 list-disc list-inside">
            {programBenefits.map((benefit, index) => (
              <li key={index}>
                <strong>{benefit.title}:</strong> {benefit.description}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-xs text-gray-600 sm:text-sm">
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
  )
}

export default CohortInfo
