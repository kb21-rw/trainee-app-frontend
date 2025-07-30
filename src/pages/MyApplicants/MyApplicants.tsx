import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import DecisionModal from "../../components/modals/DecisionModal"
import ResponseModal from "../../components/modals/ResponseModal"
import Loader from "../../components/ui/Loader"
import NotFound from "../../components/ui/NotFound"
import OverViewTable from "../../components/ui/OverViewTable"
import { useApplicantActions } from "../../utils/hooks/useApplicantActions"
import { useApplicantDecision } from "../../utils/hooks/useApplicantDecision"
import { useApplicantErrors } from "../../utils/hooks/useApplicantErrors"
import { useApplicantData } from "../../utils/hooks/useApplications"
import { useCoachIdFromJwt } from "../../utils/hooks/useGetCoachIdFromJwt"
import { UserRole } from "../../utils/types"

const MyApplicants = () => {
  const { watch } = useForm<{ cohortId: string }>({
    defaultValues: { cohortId: "" },
  })

  const currentCoachId = useCoachIdFromJwt()

  const {
    cookies,
    cohortQuery: {
      data: cohortOverview,
      error: cohortOverviewError,
      isFetching: cohortOverviewIsFetching,
    },
    coachProfileQuery: { isFetching: coachProfileIsFetching },
    decisionMutation: [
      decide,
      {
        error: decisionError,
        isSuccess: decidingIsSuccess,
        reset: applicantDecisionReset,
      },
    ],
    updateParticipantMutation: [
      ,
      {
        isSuccess: updateParticipantIsSuccess,
        error: updateParticipantError,
        reset: updateParticipantReset,
      },
    ],
  } = useApplicantData()

  const {
    decisionInfo,
    responseInfo,
    handleDecision,
    handleCloseModal,
    handleUpsertResponse,
    closeDecisionModal,
  } = useApplicantActions()

  const { handleSubmitDecision } = useApplicantDecision({
    decisionInfo,
    cookies,
    decide,
  })

  useApplicantErrors({
    cohortOverviewError,
    decisionError,
    updateParticipantError,
    decidingIsSuccess,
    updateParticipantIsSuccess,
    decisionInfo,
    closeDecisionModal,
    applicantDecisionReset,
    updateParticipantReset,
  })

  useEffect(() => {
    const subscription = watch(({ cohortId }) => {
      return cohortId
    })

    return () => subscription.unsubscribe()
  }, [watch])

  const isLoading = cohortOverviewIsFetching || coachProfileIsFetching

  const filteredApplicants = useMemo(() => {
    if (!cohortOverview?.trainees || !currentCoachId) return []
    return cohortOverview.trainees.filter(
      (trainee: { coachId: string }) => trainee.coachId === currentCoachId,
    )
  }, [cohortOverview, currentCoachId])

  return (
    <div className="flex flex-col h-full py-12 space-y-5">
      <DecisionModal
        modalType="applicant"
        decisionInfo={decisionInfo}
        closeModal={closeDecisionModal}
        onSubmit={handleSubmitDecision}
      />
      {responseInfo && (
        <ResponseModal
          responseInfo={responseInfo}
          closeModal={handleCloseModal}
        />
      )}

      {isLoading && <Loader />}
      {cohortOverview && (
        <OverViewTable
          role={UserRole.Coach}
          overviewType="applicant"
          forms={cohortOverview.forms}
          participants={filteredApplicants}
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
