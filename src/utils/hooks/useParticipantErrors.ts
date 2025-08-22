import { useEffect, useCallback } from "react"
import { useDispatch } from "react-redux"
import { handleShowAlert } from "../handleShowAlert"
import { getErrorInfo } from "../helper"
import { AlertType } from "../types"

interface UseParticipantErrorsProps {
  cohortOverviewError: any
  decisionError: any
  updateParticipantError: any
  decidingIsSuccess: boolean
  updateParticipantIsSuccess: boolean
  decisionInfo: any
  closeDecisionModal: () => void
  participantDecisionReset: () => void
  updateParticipantReset: () => void
}

export const useParticipantErrors = ({
  cohortOverviewError,
  decisionError,
  updateParticipantError,
  decidingIsSuccess,
  updateParticipantIsSuccess,
  decisionInfo,
  closeDecisionModal,
  participantDecisionReset,
  updateParticipantReset,
}: UseParticipantErrorsProps) => {
  const dispatch = useDispatch()

  // Memoized callback for handling errors
  const handleErrors = useCallback(() => {
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
        participantDecisionReset()
      }
    }
  }, [
    cohortOverviewError,
    decisionError,
    updateParticipantError,
    dispatch,
    closeDecisionModal,
    participantDecisionReset,
  ])

  // Memoized callback for handling decision success
  const handleDecisionSuccess = useCallback(() => {
    if (decidingIsSuccess) {
      handleShowAlert(dispatch, {
        type: AlertType.Success,
        message: `User is successfully ${decisionInfo?.decision?.toLowerCase() ?? "processed"}`,
      })
      closeDecisionModal()
      participantDecisionReset()
    }
  }, [
    decidingIsSuccess,
    decisionInfo,
    dispatch,
    closeDecisionModal,
    participantDecisionReset,
  ])

  // Memoized callback for handling participant update success
  const handleParticipantUpdateSuccess = useCallback(() => {
    if (updateParticipantIsSuccess) {
      handleShowAlert(dispatch, {
        type: AlertType.Success,
        message: "Coach is successfully changed",
      })
      updateParticipantReset()
    }
  }, [updateParticipantIsSuccess, dispatch, updateParticipantReset])

  useEffect(() => {
    handleErrors()
  }, [handleErrors])

  useEffect(() => {
    handleDecisionSuccess()
  }, [handleDecisionSuccess])

  useEffect(() => {
    handleParticipantUpdateSuccess()
  }, [handleParticipantUpdateSuccess])
}
