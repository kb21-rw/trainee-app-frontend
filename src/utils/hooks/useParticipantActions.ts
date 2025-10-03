import { useState } from "react"
import { CommentModalInfo, DecisionInfo, ResponseModalQuestion } from "../types"

export const useParticipantActions = () => {
  const [decisionInfo, setDecisionInfo] = useState<DecisionInfo | null>(null)
  const [responseInfo, setResponseInfo] = useState<any | null>(null)
  const [commentInfo, setCommentInfo] = useState<CommentModalInfo | null>(null)

  const handleDecision = (userData: DecisionInfo) => {
    setDecisionInfo({ ...userData })
  }

  const handleCloseModal = () => {
    setTimeout(() => setResponseInfo(null), 0)
  }

  const handleCloseCommentModal = () => {
    setTimeout(() => setCommentInfo(null), 0)
  }

  const handleUpsertResponse = (data: {
    userId: string
    question: ResponseModalQuestion
  }) => {
    setResponseInfo(data)
  }

  const handleUpsertComment = (data: CommentModalInfo) => {
    setCommentInfo(data)
  }

  const closeDecisionModal = () => {
    setDecisionInfo(null)
  }

  return {
    decisionInfo,
    responseInfo,
    commentInfo,
    handleDecision,
    handleCloseModal,
    handleUpsertResponse,
    handleCloseCommentModal,
    handleUpsertComment,
    closeDecisionModal,
  }
}
