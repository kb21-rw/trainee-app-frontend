import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import DecisionModal from "../../components/modals/DecisionModal"
import ResponseModal from "../../components/modals/ResponseModal"
import Loader from "../../components/ui/Loader"
import NotFound from "../../components/ui/NotFound"
import OverViewTable from "../../components/ui/OverViewTable"
import SmartSelect from "../../components/ui/SmartSelect"
import { useTraineeActions } from "../../utils/hooks/useTraineeControls"
import { useTraineeDecision } from "../../utils/hooks/useTraineeControls"
import { useTraineeErrors } from "../../utils/hooks/useTraineeErrors"
import { useCoachIdFromJwt } from "../../utils/hooks/useGetCoachIdFromJwt"
import { Cohort, UserRole } from "../../utils/types"
import { useTrainee } from "../../utils/hooks/useTrainee"

const MyTrainees = () => {
  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null)
  const currentCoachId = useCoachIdFromJwt()
  const { register, watch } = useForm({ defaultValues: { cohortId: "" } })

  const {
    cookies,
    cohortQuery: { data: allCohorts, isFetching: allCohortsIsFetching },
    traineeQuery: {
      data: traineeOverview,
      error: traineeOverviewError,
      isFetching: traineeOverviewIsFetching,
    },
    decisionMutation: [
      decide,
      {
        error: decisionError,
        isSuccess: decidingIsSuccess,
        isLoading: decidingIsLoading,
        reset: applicantDecisionReset,
      },
    ],
    updateParticipantMutation: [
      {
        isSuccess: updateParticipantIsSuccess,
        error: updateParticipantError,
        isLoading: updateParticipantIsLoading,
        reset: updateParticipantReset,
      },
    ],
  } = useTrainee(selectedCohortId, currentCoachId)

  const {
    decisionInfo,
    responseInfo,
    handleDecision,
    handleCloseModal,
    handleUpsertResponse,
    closeDecisionModal,
  } = useTraineeActions()

  const { handleSubmitDecision } = useTraineeDecision({
    decisionInfo,
    cookies,
    decide,
  })

  useTraineeErrors({
    traineeOverviewError,
    decisionError,
    updateParticipantError,
    decidingIsSuccess,
    updateParticipantIsSuccess,
    decisionInfo,
    closeDecisionModal,
    applicantDecisionReset,
    updateParticipantReset,
  })

  const isLoading =
    traineeOverviewIsFetching ||
    allCohortsIsFetching ||
    decidingIsLoading ||
    updateParticipantIsLoading

  useEffect(() => {
    const subscription = watch(({ cohortId }) =>
      setSelectedCohortId(cohortId ?? null),
    )
    return () => subscription.unsubscribe()
  }, [watch])

  useEffect(() => {
    if (traineeOverview && !selectedCohortId) {
      setSelectedCohortId(traineeOverview._id)
    }
  }, [traineeOverview, selectedCohortId])

  const selectedCohort = useMemo(() => {
    if (traineeOverview)
      return { value: traineeOverview._id, label: traineeOverview.name }
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
  }, [traineeOverview, selectedCohortId, allCohorts])

  const filteredTrainees = useMemo(() => {
    if (!traineeOverview?.trainees || !currentCoachId) return []
    return traineeOverview.trainees.filter(
      (trainee: any) => trainee.coachId === currentCoachId,
    )
  }, [traineeOverview, currentCoachId])

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
      {traineeOverview && (
        <OverViewTable
          role={UserRole.Coach}
          overviewType="trainee"
          forms={traineeOverview.forms}
          participants={filteredTrainees}
          participantsInfo={traineeOverview.participantsInfo}
          coaches={traineeOverview.coaches}
          updates={[]}
          stages={traineeOverview.stages}
          actions={{ handleDecision, handleUpsertResponse }}
        />
      )}
      {!isLoading && !traineeOverview && (
        <div className="flex-1">
          <NotFound entity="Cohort" type="NoData" />
        </div>
      )}
    </div>
  )
}

export default MyTrainees
