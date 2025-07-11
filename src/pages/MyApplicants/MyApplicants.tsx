import { useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import DecisionModal from "../../components/modals/DecisionModal"
import ResponseModal from "../../components/modals/ResponseModal"
import Loader from "../../components/ui/Loader"
import NotFound from "../../components/ui/NotFound"
import OverViewTable from "../../components/ui/OverViewTable"
import {
  useApplicantDecisionMutation,
  useGetApplicantsQuery,
  useGetProfileQuery,
  useUpdateParticipantMutation,
} from "../../features/user/backendApi"
import { handleShowAlert } from "../../utils/handleShowAlert"
import { getErrorInfo } from "../../utils/helper"
import {
  AlertType,
  DecisionInfo,
  ResponseModalQuestion,
  UserRole,
} from "../../utils/types"

const MyApplicants = () => {
  const [decisionInfo, setDecisionInfo] = useState<DecisionInfo | null>(null)
  const [responseInfo, setResponseInfo] = useState<any | null>(null)
  const [cookies] = useCookies(["jwt"])
  const dispatch = useDispatch()
  const { watch } = useForm<{ cohortId: string }>({
    defaultValues: { cohortId: "" },
  })

  const {
    data: cohortOverview,
    error: cohortOverviewError,
    isFetching: cohortOverviewIsFetching,
  } = useGetApplicantsQuery({
    jwt: cookies.jwt,
    cohortId: null, // For coach, we don't need to filter by cohort
  })

  const [
    decide,
    {
      error: decisionError,
      isSuccess: decidingIsSuccess,
      reset: applicantDecisionReset,
    },
  ] = useApplicantDecisionMutation()

  const [
    // updateParticipant,
    {
      isSuccess: updateParticipantIsSuccess,
      error: updateParticipantError,
      reset: updateParticipantReset,
    },
  ] = useUpdateParticipantMutation()

  const {
    data: coachProfile,
    // error: coachProfileError,
    isFetching: coachProfileIsFetching,
  } = useGetProfileQuery(cookies.jwt)

  useEffect(() => {
    const subscription = watch(({ cohortId }) => {
      return cohortId
    })

    return () => subscription.unsubscribe()
  }, [watch])

  const handleDecision = (userData: DecisionInfo) => {
    setDecisionInfo({ ...userData })
  }

  const handleCloseModal = () => {
    setTimeout(() => setResponseInfo(null), 0)
  }

  const handleUpsertResponse = (data: {
    userId: string
    question: ResponseModalQuestion
  }) => {
    setResponseInfo(data)
  }

  const handleSubmitDecision = async ({ feedback }: { feedback: string }) => {
    if (!decisionInfo) {
      return
    }

    await decide({
      jwt: cookies.jwt,
      body: {
        traineeId: decisionInfo.traineeId,
        decision: decisionInfo.decision,
        feedback,
      },
    })
  }

  if (cohortOverviewError || decisionError || updateParticipantError) {
    const { message } = getErrorInfo(
      cohortOverviewError ?? decisionError ?? updateParticipantError,
    )
    handleShowAlert(dispatch, {
      type: AlertType.Error,
      message,
    })
    if (decisionError) {
      setDecisionInfo(null)
      applicantDecisionReset()
    }
  }

  if (decidingIsSuccess) {
    handleShowAlert(dispatch, {
      type: AlertType.Success,
      message: `User is successfully ${decisionInfo?.decision.toLowerCase()}`,
    })
    setDecisionInfo(null)
    applicantDecisionReset()
  }

  if (updateParticipantIsSuccess) {
    handleShowAlert(dispatch, {
      type: AlertType.Success,
      message: "Coach is successfully changed",
    })
    updateParticipantReset()
  }

  return (
    <div className="flex flex-col h-full py-12 space-y-5">
      <DecisionModal
        modalType="applicant"
        decisionInfo={decisionInfo}
        closeModal={() => setDecisionInfo(null)}
        onSubmit={handleSubmitDecision}
      />
      {responseInfo && (
        <ResponseModal
          responseInfo={responseInfo}
          closeModal={handleCloseModal}
        />
      )}

      {cohortOverviewIsFetching || (coachProfileIsFetching && <Loader />)}
      {cohortOverview && (
        <OverViewTable
          role={UserRole.Coach}
          overviewType="applicant"
          forms={cohortOverview.forms}
          participants={
            cohortOverview?.trainees?.filter(
              (applicant: any) => applicant.coachId === coachProfile?._id,
            ) ?? []
          }
          participantsInfo={cohortOverview.participantsInfo}
          coaches={cohortOverview.coaches}
          updates={[]}
          stages={cohortOverview.stages}
          actions={{ handleDecision, handleUpsertResponse }}
        />
      )}
      {!cohortOverviewIsFetching && !cohortOverview && (
        <div className="flex-1">
          <NotFound entity="User" type="NoData" />
        </div>
      )}
    </div>
  )
}

export default MyApplicants
