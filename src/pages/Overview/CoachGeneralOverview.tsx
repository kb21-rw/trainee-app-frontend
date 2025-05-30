import {
  useGetAllCohortsQuery,
  useApplicantDecisionMutation,
  useUpdateParticipantMutation,
  useGetTraineesQuery,
} from "../../features/user/backendApi"
import {
  AlertType,
  Cookie,
  DecisionInfo,
  ResponseModalQuestion,
  UserRole,
} from "../../utils/types"
import { useState } from "react"
import OverViewTable from "../../components/ui/OverViewTable"
import { useCookies } from "react-cookie"
import { getErrorInfo } from "../../utils/helper"
import { handleShowAlert } from "../../utils/handleShowAlert"
import { useDispatch } from "react-redux"
import Loader from "../../components/ui/Loader"
import NotFound from "../../components/ui/NotFound"
import DecisionModal from "../../components/modals/DecisionModal"
import ResponseModal from "../../components/modals/ResponseModal"
import SmartSelect from "../../components/ui/SmartSelect"
import { useCohortSelection } from "../../utils/hooks/useCohortSelection"

const CoachGeneralOverview = () => {
  const [decisionInfo, setDecisionInfo] = useState<DecisionInfo | null>(null)
  const [responseInfo, setResponseInfo] = useState<{
    userId: string
    question: ResponseModalQuestion
  } | null>(null)
  const [cookies] = useCookies([Cookie.jwt])
  const dispatch = useDispatch()
  const { data: allCohorts } = useGetAllCohortsQuery({ jwt: cookies.jwt })
  const {
    selectedCohortId,
    selectedCohort,
    cohortOptions,
    register,
    isInitialized,
  } = useCohortSelection(allCohorts, null)

  const {
    data: coachOverview,
    error: coachOverviewError,
    isFetching: coachOverviewIsFetching,
  } = useGetTraineesQuery(
    {
      jwt: cookies.jwt,
      cohortId: selectedCohortId,
    },
    {
      skip: !selectedCohortId || !isInitialized,
    },
  )

  const [
    decide,
    {
      error: decisionError,
      isSuccess: decidingIsSuccess,
      reset: applicantDecisionReset,
    },
  ] = useApplicantDecisionMutation()

  const [
    updateParticipant,
    {
      isSuccess: updateParticipantIsSuccess,
      error: updateParticipantError,
      reset: updateParticipantReset,
    },
  ] = useUpdateParticipantMutation()

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
        userId: decisionInfo.userId,
        decision: decisionInfo.decision,
        feedback,
      },
    })
  }

  const handleCoachChange = ({
    coach,
    participantId,
  }: {
    coach: string
    participantId: null | string
  }) => {
    updateParticipant({
      participantId,
      body: { coach },
      jwt: cookies.jwt,
    })
  }

  if (coachOverviewError || decisionError || updateParticipantError) {
    const { message } = getErrorInfo(
      coachOverviewError ?? decisionError ?? updateParticipantError,
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
        modalType="trainee"
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

      <div className="flex items-center justify-between">
        <div className="w-52">
          <form>
            <SmartSelect
              options={cohortOptions}
              defaultValue={selectedCohort}
              register={{ ...register }}
            />
          </form>
        </div>
      </div>

      {coachOverviewIsFetching && <Loader />}
      {coachOverview && (
        <OverViewTable
          role={UserRole.Coach}
          overviewType="trainee"
          forms={coachOverview.forms}
          participants={coachOverview.trainees}
          participantsInfo={coachOverview.participantsInfo}
          coaches={coachOverview.coaches}
          updates={[]}
          stages={coachOverview.stages}
          actions={{ handleDecision, handleUpsertResponse, handleCoachChange }}
        />
      )}
      {!coachOverviewIsFetching && !coachOverview && (
        <div className="flex-1">
          <NotFound entity="Cohort" type="NoData" />
        </div>
      )}
    </div>
  )
}

export default CoachGeneralOverview
