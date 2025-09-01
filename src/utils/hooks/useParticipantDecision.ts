import { DecisionInfo } from "../types"

interface UseApplicantDecisionProps {
  decisionInfo: DecisionInfo | null
  decide: any
}

export const useParticipantDecision = ({
  decisionInfo,
  decide,
}: UseApplicantDecisionProps) => {
  const handleSubmitDecision = async ({ feedback }: { feedback: string }) => {
    if (!decisionInfo) {
      return
    }

    await decide({
      body: {
        traineeId: decisionInfo.traineeId,
        decision: decisionInfo.decision,
        feedback,
      },
    })
  }

  return { handleSubmitDecision }
}
