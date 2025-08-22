import { DecisionInfo } from "../types"

interface UseApplicantDecisionProps {
  decisionInfo: DecisionInfo | null
  cookies: any
  decide: any
}

export const useParticipantDecision = ({
  decisionInfo,
  cookies,
  decide,
}: UseApplicantDecisionProps) => {
  const handleSubmitDecision = async ({ feedback }: { feedback: string }) => {
    if (!decisionInfo) {
      return
    }

    await decide({
      jwt: cookies.jwt,
      body: {
        traineeId: decisionInfo.traineeId,
        decision: decisionInfo.decision,
        feedback,
      },
    })
  }

  return { handleSubmitDecision }
}
