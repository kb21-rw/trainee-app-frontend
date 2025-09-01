import { useState } from "react"
import { DecisionInfo, ResponseModalQuestion } from "../types"

export const useParticipantActions = () => {
  const [decisionInfo, setDecisionInfo] = useState<DecisionInfo | null>(null)
  const [responseInfo, setResponseInfo] = useState<any | null>(null)

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
