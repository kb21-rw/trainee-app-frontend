import {
  useGetAllCohortsQuery,
  useGetTraineesQuery,
} from "../../features/user/backendApi"
import { AlertType, ResponseModalQuestion, UserRole } from "../../utils/types"
import OverViewTable from "../../components/ui/OverViewTable"
import { getErrorInfo } from "../../utils/helper"
import { handleShowAlert } from "../../utils/handleShowAlert"
import { useDispatch } from "react-redux"
import Loader from "../../components/ui/Loader"
import NotFound from "../../components/ui/NotFound"
import SmartSelect from "../../components/ui/SmartSelect"
import { useCohortSelection } from "../../utils/hooks/useCohortSelection"
import { useState } from "react"
import ResponseModal from "../../components/modals/ResponseModal"

const CoachGeneralOverview = () => {
  const [responseInfo, setResponseInfo] = useState<any | null>(null)
  const dispatch = useDispatch()
  const { data: allCohorts } = useGetAllCohortsQuery()
  const {
    selectedCohortId,
    selectedCohort,
    cohortOptions,
    register,
    isInitialized,
  } = useCohortSelection(allCohorts, null)

  const {
    data: coachOverview,
    error: coachOverviewError,
    isFetching: coachOverviewIsFetching,
  } = useGetTraineesQuery(
    {
      cohortId: selectedCohortId,
    },
    {
      skip: !selectedCohortId || !isInitialized,
    },
  )

  const handleUpsertResponse = (data: {
    userId: string
    question: ResponseModalQuestion
    readonly?: boolean
  }) => {
    setResponseInfo(data)
  }

  const handleCloseModal = () => {
    setTimeout(() => setResponseInfo(null), 0)
  }

  if (coachOverviewError) {
    const { message } = getErrorInfo(coachOverviewError)
    handleShowAlert(dispatch, {
      type: AlertType.Error,
      message,
    })
  }

  return (
    <div className="flex flex-col h-full py-12 space-y-5">
      <div className="flex items-center justify-between">
        {responseInfo && (
          <ResponseModal
            responseInfo={{
              userId: responseInfo.userId,
              question: responseInfo.question,
              readonly: true,
            }}
            closeModal={handleCloseModal}
          />
        )}
        <div className="w-52">
          <form>
            <SmartSelect
              options={cohortOptions}
              defaultValue={selectedCohort}
              register={{ ...register }}
            />
          </form>
        </div>
      </div>

      {coachOverviewIsFetching && <Loader />}
      {coachOverview && (
        <OverViewTable
          role={UserRole.Coach}
          overviewType="trainee"
          forms={coachOverview.forms}
          participants={coachOverview.trainees}
          participantsInfo={coachOverview.participantsInfo}
          coaches={coachOverview.coaches}
          updates={[]}
          stages={coachOverview.stages}
          actions={{ handleUpsertResponse }}
        />
      )}
      {!coachOverviewIsFetching && !coachOverview && (
        <div className="flex-1">
          <NotFound entity="Cohort" type="NoData" />
        </div>
      )}
    </div>
  )
}

export default CoachGeneralOverview
