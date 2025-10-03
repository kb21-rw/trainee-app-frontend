import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import DecisionModal from "../../components/modals/DecisionModal"
import ResponseModal from "../../components/modals/ResponseModal"
import Loader from "../../components/ui/Loader"
import NotFound from "../../components/ui/NotFound"
import OverViewTable from "../../components/ui/OverViewTable"
import SmartSelect from "../../components/ui/SmartSelect"
import { Cohort, CohortParticipant, UserRole } from "../../utils/types"
import { useUserIdFromJwt } from "../../utils/hooks/useGetCoachIdFromJwt"
import { useParticipantActions } from "../../utils/hooks/useParticipantActions"
import { useParticipantDecision } from "../../utils/hooks/useParticipantDecision"
import { useParticipantErrors } from "../../utils/hooks/useParticipantErrors"
import { useParticipantData } from "../../utils/hooks/useParticipantData"
import CommentModal from "../../components/modals/CommentModal"

const MyTrainees = () => {
  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null)
  const currentCoachId = useUserIdFromJwt()
  const { register, watch } = useForm({ defaultValues: { cohortId: "" } })

  const {
    cohortQuery: { data: allCohorts, isFetching: allCohortsIsFetching },
    participantQuery: {
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
        reset: traineeDecisionReset,
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
  } = useParticipantData(selectedCohortId)

  const {
    decisionInfo,
    responseInfo,
    commentInfo,
    handleDecision,
    handleCloseModal,
    handleUpsertResponse,
    handleUpsertComment,
    handleCloseCommentModal,
    closeDecisionModal,
  } = useParticipantActions()

  const { handleSubmitDecision } = useParticipantDecision({
    decisionInfo,
    decide,
  })

  useParticipantErrors({
    cohortOverviewError,
    decisionError,
    updateParticipantError,
    decidingIsSuccess,
    updateParticipantIsSuccess,
    decisionInfo,
    closeDecisionModal,
    participantDecisionReset: traineeDecisionReset,
    updateParticipantReset,
  })

  const isLoading =
    cohortOverviewIsFetching || allCohortsIsFetching || coachProfileIsFetching

  useEffect(() => {
    const subscription = watch(({ cohortId }) =>
      setSelectedCohortId(cohortId ?? null),
    )
    return () => subscription.unsubscribe()
  }, [watch])

  const selectedCohort = useMemo(() => {
    if (cohortOverview)
      return { value: cohortOverview._id, label: cohortOverview.name }
    if (selectedCohortId) {
      const cohort = allCohorts?.find(
        (cohort: Cohort) => cohort._id === selectedCohortId,
      )
      return cohort ? { value: cohort._id, label: cohort.name } : null
    }

    const activeCohort = allCohorts?.find((cohort: Cohort) => cohort.isActive)

    return activeCohort
      ? { value: activeCohort._id, label: activeCohort.name }
      : null
  }, [cohortOverview, selectedCohortId, allCohorts])

  const filteredTrainees = useMemo(() => {
    if (!cohortOverview?.trainees || !currentCoachId) return []
    return cohortOverview.trainees.filter(
      (trainee: CohortParticipant) =>
        trainee.postselectionCoachId === currentCoachId,
    )
  }, [cohortOverview, currentCoachId])

  const cohortOptions =
    allCohorts?.map((cohort: Cohort) => ({
      value: cohort._id,
      label: cohort.name,
    })) ?? []

  return (
    <div className="flex flex-col h-full py-12 space-y-5">
      <DecisionModal
        modalType="trainee"
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

      {commentInfo && (
        <CommentModal
          commentInfo={commentInfo}
          closeModal={handleCloseCommentModal}
        />
      )}

      <div className="flex items-center justify-between">
        <div className="w-52">
          <form>
            <SmartSelect
              options={cohortOptions}
              defaultValue={selectedCohort ?? undefined}
              register={{ ...register("cohortId") }}
            />
          </form>
        </div>
      </div>

      {isLoading && <Loader />}
      {cohortOverview && (
        <OverViewTable
          role={UserRole.Coach}
          overviewType="trainee"
          forms={cohortOverview.forms}
          participants={filteredTrainees}
          participantsInfo={cohortOverview.participantsInfo}
          coaches={cohortOverview.coaches}
          updates={[]}
          stages={cohortOverview.stages}
          actions={{
            handleDecision,
            handleUpsertResponse,
            handleUpsertComment,
          }}
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

export default MyTrainees
