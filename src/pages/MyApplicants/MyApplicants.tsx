import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import DecisionModal from "../../components/modals/DecisionModal"
import ResponseModal from "../../components/modals/ResponseModal"
import Loader from "../../components/ui/Loader"
import NotFound from "../../components/ui/NotFound"
import OverViewTable from "../../components/ui/OverViewTable"
import SmartSelect from "../../components/ui/SmartSelect"
import { useParticipantActions } from "../../utils/hooks/useParticipantActions"
import { useParticipantDecision } from "../../utils/hooks/useParticipantDecision"
import { useParticipantErrors } from "../../utils/hooks/useParticipantErrors"
import { useParticipantData } from "../../utils/hooks/useParticipantData"
import { Cohort, CohortParticipant, UserRole } from "../../utils/types"
import { useUserIdFromJwt } from "../../utils/hooks/useGetCoachIdFromJwt"

const MyApplicants = () => {
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
  } = useParticipantData(selectedCohortId)

  const {
    decisionInfo,
    responseInfo,
    handleDecision,
    handleCloseModal,
    handleUpsertResponse,
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
    participantDecisionReset: applicantDecisionReset,
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

  const filteredApplicants = useMemo(() => {
    if (!cohortOverview?.trainees || !currentCoachId) return []
    return cohortOverview.trainees.filter(
      (trainee: CohortParticipant) =>
        trainee.preselectionCoachId === currentCoachId,
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
