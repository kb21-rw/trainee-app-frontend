import { useState } from "react"
import { DecisionInfo, ResponseModalQuestion } from "../../utils/types"

export const useApplicantActions = () => {
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

// hooks/useApplicantErrors.ts
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { handleShowAlert } from "../../utils/handleShowAlert"
import { getErrorInfo } from "../../utils/helper"
import { AlertType } from "../../utils/types"

interface UseApplicantErrorsProps {
  cohortOverviewError: any
  decisionError: any
  updateParticipantError: any
  decidingIsSuccess: boolean
  updateParticipantIsSuccess: boolean
  decisionInfo: any
  closeDecisionModal: () => void
  applicantDecisionReset: () => void
  updateParticipantReset: () => void
}

export const useApplicantErrors = ({
  cohortOverviewError,
  decisionError,
  updateParticipantError,
  decidingIsSuccess,
  updateParticipantIsSuccess,
  decisionInfo,
  closeDecisionModal,
  applicantDecisionReset,
  updateParticipantReset,
}: UseApplicantErrorsProps) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (cohortOverviewError || decisionError || updateParticipantError) {
      const { message } = getErrorInfo(
        cohortOverviewError ?? decisionError ?? updateParticipantError,
      )
      handleShowAlert(dispatch, {
        type: AlertType.Error,
        message,
      })
      if (decisionError) {
        closeDecisionModal()
        applicantDecisionReset()
      }
    }
  }, [
    cohortOverviewError,
    decisionError,
    updateParticipantError,
    dispatch,
    closeDecisionModal,
    applicantDecisionReset,
  ])

  useEffect(() => {
    if (decidingIsSuccess) {
      handleShowAlert(dispatch, {
        type: AlertType.Success,
        message: `User is successfully ${decisionInfo?.decision.toLowerCase()}`,
      })
      closeDecisionModal()
      applicantDecisionReset()
    }
  }, [
    decidingIsSuccess,
    decisionInfo,
    dispatch,
    closeDecisionModal,
    applicantDecisionReset,
  ])

  useEffect(() => {
    if (updateParticipantIsSuccess) {
      handleShowAlert(dispatch, {
        type: AlertType.Success,
        message: "Coach is successfully changed",
      })
      updateParticipantReset()
    }
  }, [updateParticipantIsSuccess, dispatch, updateParticipantReset])
}
