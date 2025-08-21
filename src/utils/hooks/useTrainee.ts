import { useSelector } from "react-redux"
import {
  useApplicantDecisionMutation,
  useGetAllCohortsQuery,
  useGetTraineesForCoachQuery,
  useUpdateParticipantMutation,
} from "../../features/user/backendApi"
import { RootState } from "../../store"

export const useTrainee = (
  selectedCohortId: string | null,
  currentCoachId: string | null,
) => {
  const cookies = useSelector((state: RootState) => state.cookies)

  const cohortQuery = useGetAllCohortsQuery({ jwt: cookies.jwt })

  const traineeQuery = useGetTraineesForCoachQuery({
    jwt: cookies.jwt,
    cohortId: selectedCohortId,
    coachId: currentCoachId,
  })

  const decisionMutation = useApplicantDecisionMutation()
  const updateParticipantMutation = useUpdateParticipantMutation()

  return {
    cookies,
    cohortQuery,
    traineeQuery,
    decisionMutation,
    updateParticipantMutation,
  }
}
