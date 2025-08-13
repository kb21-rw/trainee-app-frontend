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
  UserStatus,
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
  userStatus: UserStatus
}

export default function ApplicationFormActions({
  applicationForm,
  role,
  userStatus,
}: ApplicationFormActionsProps) {
  const status =
    role === UserRole.Prospect && userStatus === UserStatus.Applied
      ? ApplicationFormStatus.Submitted
      : getApplicationFormStatus(applicationForm)

  const [cookies] = useCookies([Cookie.jwt])
  const { data, refetch, isLoading } = useGetProfileQuery(cookies.jwt)
  const dispatch = useDispatch()

  const [displayStatus, setdisplayStatus] = useState<ApplicationFormStatus>(
    () =>
      data?.status === UserStatus.OnWaitList
        ? ApplicationFormStatus.JoinedWaitList
        : status,
  )

  const { socket } = useContext(SocketContext)

  const handleClick = () => {
    window.open(applicationFormStatusData[displayStatus].buttonLink, "_blank")
  }

  useEffect(() => {
    if (socket) {
      socket.emit("join-room", data?.email)

      socket.on("joinedTheWaitList", (message) => {
        if (data?.email === message.email) {
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
  }, [socket, data?.email, refetch, dispatch])

  if (isLoading || !data) {
    return <div>Loading...</div>
  }

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
          <div className="text-center flex items-center flex-col">
            <h1 className="text-2xl font-medium text-gray-600 text-center">
              {applicationFormStatusData[displayStatus].heading}
            </h1>
          </div>
          <div className="flex flex-col items-center justify-center max-w-2xl p-6 mx-auto space-y-4 border border-gray-300 rounded-lg shadow-lg">
            <p className="text-center text-gray-500">
              {applicationFormStatusData[displayStatus].description}
            </p>

            {data.status !== UserStatus.OnWaitList && (
              <Button
                className="bg-primary-dark text-white px-6 py-3 rounded-md"
                onClick={handleClick}
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
