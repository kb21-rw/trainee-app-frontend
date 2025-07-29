import { useCookies } from "react-cookie"
import {
  useApplicantDecisionMutation,
  useGetApplicantsQuery,
  useGetProfileQuery,
  useUpdateParticipantMutation,
  useGetAllCohortsQuery,
} from "../../features/user/backendApi"

export const useApplicantData = () => {
  const [cookies] = useCookies(["jwt"])

  const cohortQuery = useGetAllCohortsQuery({
    jwt: cookies.jwt,
    query: "",
  })

  const applicantQuery = useGetApplicantsQuery({
    jwt: cookies.jwt,
    cohortId: null, // For coach, we don't need to filter by cohort
  })

  const coachProfileQuery = useGetProfileQuery(cookies.jwt)

  const decisionMutation = useApplicantDecisionMutation()
  const updateParticipantMutation = useUpdateParticipantMutation()

  return {
    cookies,
    cohortQuery,
    applicantQuery,
    coachProfileQuery,
    decisionMutation,
    updateParticipantMutation,
  }
}
