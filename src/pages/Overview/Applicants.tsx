import {
  useGetApplicantsQuery,
  useGetAllCohortsQuery,
  useApplicantDecisionMutation,
  useGetCoachesQuery,
} from "../../features/user/backendApi";
import {
  AlertType,
  ButtonSize,
  Cohort as BaseCohort,
  Cookie,
  DecisionInfo,
  ResponseModalQuestion,
} from "../../utils/types";
import { useState } from "react";
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import OverViewTable from "../../components/ui/OverViewTable";
import Button from "../../components/ui/Button";
import { useCookies } from "react-cookie";
import { getErrorInfo } from "../../utils/helper";
import { handleShowAlert } from "../../utils/handleShowAlert";
import { useDispatch } from "react-redux";
import Loader from "../../components/ui/Loader";
import NotFound from "../../components/ui/NotFound";
import DecisionModal from "../../components/modals/DecisionModal";
import ResponseModal from "../../components/modals/ResponseModal";

interface Cohort extends Pick<BaseCohort, "_id" | "name" | "description"> {}

const Applicants = () => {
  const [decisionInfo, setDecisionInfo] = useState<DecisionInfo | null>(null);
  const [responseInfo, setResponseInfo] = useState<any | null>(null);
  const [cookies] = useCookies([Cookie.jwt]);
  const { data: allCohorts } = useGetAllCohortsQuery({ jwt: cookies.jwt });
  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null);
  const dispatch = useDispatch();
  const {
    data: cohortOverview,
    error: cohortOverviewError,
    isFetching: cohortOverviewIsFetching,
  } = useGetApplicantsQuery({
    jwt: cookies.jwt,
    cohortId: selectedCohortId,
  });
  const {
    data: coaches,
    error: coachesError,
    isFetching: coachesIsFetching,
  } = useGetCoachesQuery({
    jwt: cookies.jwt,
    cohortId: selectedCohortId,
  });

  const [
    decide,
    {
      error: decisionError,
      isSuccess: decidingIsSuccess,
      reset: applicantDecisionReset,
    },
  ] = useApplicantDecisionMutation();

  const handleChange = (event: SelectChangeEvent) => {
    const newCohortId = event.target.value;
    setSelectedCohortId(newCohortId);
  };

  const handleDecision = (userData: DecisionInfo) => {
    setDecisionInfo({ ...userData });
  };

  const handleCloseModal = () => {
    setTimeout(() => setResponseInfo(null), 0);
  };

  const handleUpsertResponse = (data: {
    userId: string;
    question: ResponseModalQuestion;
  }) => {
    setResponseInfo(data);
  };

  const handleSubmitDecision = async ({ feedback }: { feedback: string }) => {
    if (!decisionInfo) {
      return;
    }

    await decide({
      jwt: cookies.jwt,
      body: {
        userId: decisionInfo.userId,
        decision: decisionInfo.decision,
        feedback,
      },
    });
  };

  if (cohortOverviewError || decisionError || coachesError) {
    const { message } = getErrorInfo(
      cohortOverviewError ?? decisionError ?? coachesError,
    );
    handleShowAlert(dispatch, {
      type: AlertType.Error,
      message,
    });
    setDecisionInfo(null);
    applicantDecisionReset();
  }

  if (decidingIsSuccess) {
    handleShowAlert(dispatch, {
      type: AlertType.Success,
      message: `User is successfully ${decisionInfo?.decision.toLowerCase()}`,
    });
    setDecisionInfo(null);
    applicantDecisionReset();
  }

  if (cohortOverview && !selectedCohortId) {
    setSelectedCohortId(cohortOverview._id);
  }

  return (
    <div className="py-12 space-y-5">
      <DecisionModal
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

      <div className="flex justify-between items-center">
        <div className="w-52">
          <Box>
            <FormControl fullWidth>
              <Select
                labelId="cohort-label"
                id="single-select"
                value={selectedCohortId ?? cohortOverview?._id ?? ""}
                onChange={handleChange}
              >
                {allCohorts?.map((cohort: Cohort) => (
                  <MenuItem key={cohort._id} value={cohort._id}>
                    {cohort.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </div>
        <Button size={ButtonSize.Medium}>Add Applicant</Button>
      </div>

      {cohortOverviewIsFetching | coachesIsFetching && <Loader />}
      {cohortOverview && (
        <OverViewTable
          forms={cohortOverview.forms}
          participants={cohortOverview.applicants}
          coaches={coaches}
          updates={[]}
          stages={cohortOverview.applicationForm.stages}
          actions={{ handleDecision, handleUpsertResponse }}
        />
      )}
      {!cohortOverviewIsFetching && !cohortOverview && (
        <NotFound entity="Cohort" type="NoData" />
      )}
    </div>
  );
};

export default Applicants;
