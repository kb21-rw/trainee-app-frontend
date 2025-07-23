import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { handleShowAlert } from "../handleShowAlert"
import { getErrorInfo } from "../helper"
import { AlertType } from "../types"

interface UseTraineeErrorsProps {
  traineeOverviewError: any
  decisionError: any
  updateParticipantError: any
  decidingIsSuccess: boolean
  updateParticipantIsSuccess: boolean
  decisionInfo: any
  closeDecisionModal: () => void
  applicantDecisionReset: () => void
  updateParticipantReset: () => void
}

export const useTraineeErrors = ({
  traineeOverviewError,
  decisionError,
  updateParticipantError,
  decidingIsSuccess,
  updateParticipantIsSuccess,
  decisionInfo,
  closeDecisionModal,
  applicantDecisionReset,
  updateParticipantReset,
}: UseTraineeErrorsProps) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (traineeOverviewError || decisionError || updateParticipantError) {
      const { message } = getErrorInfo(
        traineeOverviewError ?? decisionError ?? updateParticipantError,
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
    traineeOverviewError,
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
    decisionInfo?.decision,
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
