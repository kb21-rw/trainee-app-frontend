import { useSelector } from "react-redux"
import {
  useApplicantDecisionMutation,
  useGetApplicantsQuery,
  useGetProfileQuery,
  useUpdateParticipantMutation,
  useGetAllCohortsQuery,
} from "../../features/user/backendApi"
import { RootState } from "../../store"

export const useParticipantData = (selectedCohortId: string | null) => {
  const cookies = useSelector((state: RootState) => state.cookies)

  const cohortQuery = useGetAllCohortsQuery({
    jwt: cookies.jwt,
    query: "",
  })

  const applicantQuery = useGetApplicantsQuery({
    jwt: cookies.jwt,
    cohortId: selectedCohortId,
  })

  const coachProfileQuery = useGetProfileQuery(cookies.jwt)

  const decisionMutation = useApplicantDecisionMutation()
  const updateParticipantMutation = useUpdateParticipantMutation()

  return {
    cookies,
    cohortQuery,
    participantQuery: applicantQuery,
    coachProfileQuery,
    decisionMutation,
    updateParticipantMutation,
  }
}
