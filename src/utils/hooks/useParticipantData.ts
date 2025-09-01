import {
  useApplicantDecisionMutation,
  useGetApplicantsQuery,
  useGetProfileQuery,
  useUpdateParticipantMutation,
  useGetAllCohortsQuery,
} from "../../features/user/backendApi"

export const useParticipantData = (selectedCohortId: string | null) => {
  const cohortQuery = useGetAllCohortsQuery({
    query: "",
  })

  const applicantQuery = useGetApplicantsQuery({
    cohortId: selectedCohortId,
  })

  const coachProfileQuery = useGetProfileQuery()

  const decisionMutation = useApplicantDecisionMutation()
  const updateParticipantMutation = useUpdateParticipantMutation()

  return {
    cohortQuery,
    participantQuery: applicantQuery,
    coachProfileQuery,
    decisionMutation,
    updateParticipantMutation,
  }
}
