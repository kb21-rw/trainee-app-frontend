import { useEffect, useCallback } from "react"
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

  // Memoized callback for handling decision success
  const handleDecisionSuccess = useCallback(() => {
    if (decidingIsSuccess) {
      handleShowAlert(dispatch, {
        type: AlertType.Success,
        message: `User is successfully ${decisionInfo?.decision?.toLowerCase() ?? "processed"}`,
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
