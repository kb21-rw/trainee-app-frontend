import { useCookies } from "react-cookie"
import {
  useApplicantDecisionMutation,
  useGetApplicantsQuery,
  useGetProfileQuery,
  useUpdateParticipantMutation,
} from "../../features/user/backendApi"

export const useApplicantData = () => {
  const [cookies] = useCookies(["jwt"])

  const cohortQuery = useGetApplicantsQuery({
    jwt: cookies.jwt,
    cohortId: null, // For coach, we don't need to filter by cohort
  })

  const coachProfileQuery = useGetProfileQuery(cookies.jwt)

  const decisionMutation = useApplicantDecisionMutation()
  const updateParticipantMutation = useUpdateParticipantMutation()

  return {
    cookies,
    cohortQuery,
    coachProfileQuery,
    decisionMutation,
    updateParticipantMutation,
  }
}
