import { useCookies } from "react-cookie"
import {
  useApplicantDecisionMutation,
  useGetAllCohortsQuery,
  useGetTraineesForCoachQuery,
  useUpdateParticipantMutation,
} from "../../features/user/backendApi"
import { Cookie } from "../types"

export const useTrainee = (
  selectedCohortId: string | null,
  currentCoachId: string | null,
) => {
  const [cookies] = useCookies([Cookie.jwt])

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
