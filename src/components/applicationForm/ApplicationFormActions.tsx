import { useContext, useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { showAlert } from "../../features/user/alertSlice"
import { useGetProfileQuery } from "../../features/user/backendApi"
import { applicationFormStatusData } from "../../utils/data"
import { getApplicationFormStatus, getFormattedDate } from "../../utils/helper"
import {
  AlertType,
  ApplicationForm,
  ApplicationFormStatus,
  ButtonSize,
  Cookie,
  UserResponseQuestion,
  UserRole,
} from "../../utils/types"
import Button from "../ui/Button"
import CohortInfo from "../ui/CohortInfo"
import { SocketContext } from "../../utils/contexts/SocketContext"

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
  const { data, refetch } = useGetProfileQuery(cookies.jwt)
  const dispatch = useDispatch()

  const [displayStatus, setdisplayStatus] = useState<ApplicationFormStatus>(
    data.isOnWaitList ? ApplicationFormStatus.JoinedWaitList : status,
  )

  const { socket } = useContext(SocketContext)

  useEffect(() => {
    if (socket) {
      socket.emit("join-room", data.email)

      socket.on("joinedTheWaitList", (message) => {
        if (data.email === message.email) {
          setdisplayStatus(ApplicationFormStatus.JoinedWaitList)
          refetch()
        }
      })

      socket.on("waitListError", (errorMessage) => {
        dispatch(
          showAlert({
            message: errorMessage.errorMessage,
            type: AlertType.Error,
            displayDuration: 10000,
          }),
        )
      })
    }

    return () => {
      socket?.off("joinedTheWaitList")
      socket?.off("waitListError")
    }
  }, [socket, data.email, refetch, dispatch])

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
              {applicationFormStatusData[displayStatus].heading}
            </h1>
          </div>
          <div className="flex flex-col items-center justify-center max-w-2xl p-6 mx-auto space-y-4 border border-gray-300 rounded-lg shadow-lg">
            <p className="text-center text-gray-500">
              {applicationFormStatusData[displayStatus].description}
            </p>

            {!data.isOnWaitList && (
              <Button
                className="px-6 py-3 text-white rounded-md bg-primary-dark"
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
