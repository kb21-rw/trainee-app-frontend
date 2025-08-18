import {
  useGetApplicantsQuery,
  useGetAllCohortsQuery,
  useApplicantDecisionMutation,
  useUpdateParticipantMutation,
} from "../../features/user/backendApi"
import {
  AlertType,
  ButtonSize,
  Cohort,
  DecisionInfo,
  ResponseModalQuestion,
  UserRole,
} from "../../utils/types"
import { useEffect, useState } from "react"
import OverViewTable from "../../components/ui/OverViewTable"
import Button from "../../components/ui/Button"
import { getErrorInfo } from "../../utils/helper"
import { handleShowAlert } from "../../utils/handleShowAlert"
import { useDispatch, useSelector } from "react-redux"
import Loader from "../../components/ui/Loader"
import NotFound from "../../components/ui/NotFound"
import DecisionModal from "../../components/modals/DecisionModal"
import ResponseModal from "../../components/modals/ResponseModal"
import SmartSelect from "../../components/ui/SmartSelect"
import { useForm } from "react-hook-form"
import AddApplicantsModal from "../../components/modals/AddApplicantsModal"
import { RootState } from "../../store"

const Applicants = () => {
  const [decisionInfo, setDecisionInfo] = useState<DecisionInfo | null>(null)
  const [responseInfo, setResponseInfo] = useState<any | null>(null)
  const [isAddingApplicants, setIsAddingApplicants] = useState<boolean>(false)
  const cookies = useSelector((state: RootState) => state.cookies)
  const { data: allCohorts } = useGetAllCohortsQuery({ jwt: cookies.jwt })
  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null)
  const dispatch = useDispatch()
  const { register, watch } = useForm<{ cohortId: string }>({
    defaultValues: { cohortId: "" },
  })
  const {
    data: cohortOverview,
    error: cohortOverviewError,
    isFetching: cohortOverviewIsFetching,
  } = useGetApplicantsQuery({
    jwt: cookies.jwt,
    cohortId: selectedCohortId,
  })

  const [
    decide,
    {
      error: decisionError,
      isSuccess: decidingIsSuccess,
      reset: applicantDecisionReset,
    },
  ] = useApplicantDecisionMutation()

  const [
    updateParticipant,
    {
      isSuccess: updateParticipantIsSuccess,
      error: updateParticipantError,
      reset: updateParticipantReset,
    },
  ] = useUpdateParticipantMutation()

  useEffect(() => {
    const subscription = watch(({ cohortId }) => {
      setSelectedCohortId(cohortId ?? null)
    })

    return () => subscription.unsubscribe()
  }, [watch])

  const selectedCohortFromOverview = cohortOverview
    ? { value: cohortOverview._id, label: cohortOverview.name }
    : null

  const selectedCohortFromId = selectedCohortId
    ? {
        value: selectedCohortId,
        label:
          allCohorts?.find((cohort: Cohort) => cohort._id === selectedCohortId)
            ?.name ?? "",
      }
    : null

  const activeCohort = allCohorts?.find((cohort: Cohort) => cohort.isActive)
  const selectedCohortFromActive = activeCohort
    ? { value: activeCohort._id, label: activeCohort.name }
    : null

  const selectedCohort =
    selectedCohortFromOverview ??
    selectedCohortFromId ??
    selectedCohortFromActive ??
    undefined

  const handleAddApplicants = () => setIsAddingApplicants(true)
  const handleCloseAddApplicantsModal = () =>
    setTimeout(() => setIsAddingApplicants(false), 0)

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

  const handleCoachChange = ({
    coachId,
    participantId,
  }: {
    coachId: string
    participantId: null | string
  }) => {
    updateParticipant({
      participantId,
      body: { coachId },
      jwt: cookies.jwt,
    })
  }

  if (cohortOverviewError || decisionError || updateParticipantError) {
    const { message } = getErrorInfo(
      cohortOverviewError ?? decisionError ?? updateParticipantError,
    )
    handleShowAlert(dispatch, {
      type: AlertType.Error,
      message,
    })
    if (decisionError) {
      setDecisionInfo(null)
      applicantDecisionReset()
    }
  }

  if (decidingIsSuccess) {
    handleShowAlert(dispatch, {
      type: AlertType.Success,
      message: `User is successfully ${decisionInfo?.decision.toLowerCase()}`,
    })
    setDecisionInfo(null)
    applicantDecisionReset()
  }

  if (updateParticipantIsSuccess) {
    handleShowAlert(dispatch, {
      type: AlertType.Success,
      message: "Coach is successfully changed",
    })
    updateParticipantReset()
  }

  if (cohortOverview && !selectedCohortId) {
    setSelectedCohortId(cohortOverview._id)
  }

  return (
    <div className="flex flex-col h-full py-12 space-y-5">
      <DecisionModal
        modalType="applicant"
        decisionInfo={decisionInfo}
        closeModal={() => setDecisionInfo(null)}
        onSubmit={handleSubmitDecision}
      />
      {responseInfo && (
        <ResponseModal
          responseInfo={responseInfo}
          closeModal={handleCloseModal}
        />
      )}
      {isAddingApplicants && (
        <AddApplicantsModal
          isOpen={isAddingApplicants}
          onClose={handleCloseAddApplicantsModal}
        />
      )}

      <div className="flex items-center justify-between">
        <div className="w-52">
          <form>
            <SmartSelect
              options={
                allCohorts?.map((cohort: Cohort) => ({
                  value: cohort._id,
                  label: cohort.name,
                })) ?? []
              }
              defaultValue={selectedCohort}
              register={{ ...register("cohortId") }}
            />
          </form>
        </div>
        {/* Display a button only if it's an active cohort which has an application form */}
        {cohortOverview?.isActive && cohortOverview.applicationForm && (
          <Button size={ButtonSize.Medium} onClick={handleAddApplicants}>
            Add Applicant
          </Button>
        )}
      </div>

      {cohortOverviewIsFetching && <Loader />}
      {cohortOverview && (
        <OverViewTable
          role={UserRole.Admin}
          overviewType="applicant"
          forms={cohortOverview.forms}
          participants={cohortOverview.trainees}
          participantsInfo={cohortOverview.participantsInfo}
          coaches={cohortOverview.coaches}
          updates={[]}
          stages={cohortOverview.stages}
          actions={{ handleDecision, handleUpsertResponse, handleCoachChange }}
        />
      )}
      {!cohortOverviewIsFetching && !cohortOverview && (
        <div className="flex-1">
          <NotFound entity="Cohort" type="NoData" />
        </div>
      )}
    </div>
  )
}

export default Applicants
