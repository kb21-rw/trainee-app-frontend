import { useState } from "react"
import { DecisionInfo, ResponseModalQuestion } from "../types"

interface UseTraineeActionsProps {
  decisionInfo: DecisionInfo | null
  cookies: any
  decide: any
}

export const useTraineeActions = () => {
  const [decisionInfo, setDecisionInfo] = useState<DecisionInfo | null>(null)
  const [responseInfo, setResponseInfo] = useState<{
    userId: string
    question: ResponseModalQuestion
  } | null>(null)

  const handleDecision = (userData: DecisionInfo) => {
    setDecisionInfo({ ...userData })
  }

  const handleCloseModal = () => {
    setTimeout(() => setResponseInfo(null), 0)
  }

  const handleUpsertResponse = (data: {
    userId: string
    question: ResponseModalQuestion
  }) => {
    setResponseInfo(data)
  }

  const closeDecisionModal = () => {
    setDecisionInfo(null)
  }

  return {
    decisionInfo,
    responseInfo,
    handleDecision,
    handleCloseModal,
    handleUpsertResponse,
    closeDecisionModal,
  }
}

export const useTraineeDecision = ({
  decisionInfo,
  cookies,
  decide,
}: UseTraineeActionsProps) => {
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
