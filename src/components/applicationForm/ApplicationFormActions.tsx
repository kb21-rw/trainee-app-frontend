import { useContext, useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import { Link } from "react-router-dom"
import { useGetProfileQuery } from "../../features/user/backendApi"
import { getApplicationFormStatus, getFormattedDate } from "../../utils/helper"
import { WaitListSocketContext } from "../../utils/contexts/WaitListSocketContext"
import { applicationFormStatusData } from "../../utils/data"
import {
  ApplicationForm,
  ApplicationFormStatus,
  ButtonSize,
  Cookie,
  UserResponseQuestion,
  UserRole,
} from "../../utils/types"
import Button from "../ui/Button"
import CohortInfo from "../ui/CohortInfo"

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

  const [cookies] = useCookies([Cookie.jwt])
  const { data } = useGetProfileQuery(cookies.jwt)

  const [displayStatus, setdisplayStatus] = useState<ApplicationFormStatus>(
    data.isOnWaitList ? ApplicationFormStatus.JoinedWaitList : status,
  )

  const { socket } = useContext(WaitListSocketContext)

  useEffect(() => {
    socket?.on("joinedTheWaitList", (message) => {
      if (data.email === message.email)
        setdisplayStatus(ApplicationFormStatus.JoinedWaitList)
    })

    socket?.emit("join-room", data.email)

    return () => {
      socket?.off("joinTheWaitList")
    }
  }, [socket, data.email])

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
              {applicationFormStatusData[displayStatus].heading}
            </h1>
          </div>
          <div className="max-w-2xl mx-auto flex flex-col items-center justify-center border border-gray-300 rounded-lg p-6 shadow-lg space-y-4">
            <p className="text-center text-gray-500">
              {applicationFormStatusData[displayStatus].description}
            </p>

            {!data.isOnWaitList && (
              <Button
                className="bg-primary-dark text-white px-6 py-3 rounded-md"
                onClick={() =>
                  window.open(
                    applicationFormStatusData[
                      ApplicationFormStatus.NoApplication
                    ].buttonLink,
                    "_blank",
                  )
                }
              >
                {applicationFormStatusData[displayStatus].buttonText}
              </Button>
            )}

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
