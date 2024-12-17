import {
  useGetApplicantsQuery,
  useGetAllCohortsQuery,
  useApplicantDecisionMutation,
  useGetCoachesQuery,
  useUpdateParticipantMutation,
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
    data: cohortCoaches,
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

  const [
    updateParticipant,
    {
      isSuccess: updateParticipantIsSuccess,
      error: updateParticipantError,
      reset: updateParticipantReset,
    },
  ] = useUpdateParticipantMutation();

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

  const handleCoachChange = ({
    coach,
    participantId,
  }: {
    coach: string;
    participantId: null | string;
  }) => {
    updateParticipant({
      participantId,
      body: { coach },
      jwt: cookies.jwt,
    });
  };

  if (
    cohortOverviewError ||
    decisionError ||
    coachesError ||
    updateParticipantError
  ) {
    const { message } = getErrorInfo(
      cohortOverviewError ??
        decisionError ??
        coachesError ??
        updateParticipantError,
    );
    handleShowAlert(dispatch, {
      type: AlertType.Error,
      message,
    });
    if (decisionError) {
      setDecisionInfo(null);
      applicantDecisionReset();
    }
  }

  if (decidingIsSuccess) {
    handleShowAlert(dispatch, {
      type: AlertType.Success,
      message: `User is successfully ${decisionInfo?.decision.toLowerCase()}`,
    });
    setDecisionInfo(null);
    applicantDecisionReset();
  }

  if (updateParticipantIsSuccess) {
    handleShowAlert(dispatch, {
      type: AlertType.Success,
      message: "Coach is successfully changed",
    });
    updateParticipantReset();
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
        </div>
        <Button size={ButtonSize.Medium}>Add Applicant</Button>
      </div>

      {(cohortOverviewIsFetching || coachesIsFetching) && <Loader />}
      {cohortOverview && (
        <OverViewTable
          forms={cohortOverview.forms}
          participants={cohortOverview.applicants}
          coaches={cohortCoaches.coaches}
          updates={[]}
          stages={cohortOverview.applicationForm.stages}
          actions={{ handleDecision, handleUpsertResponse, handleCoachChange }}
        />
      )}
      {!cohortOverviewIsFetching && !cohortOverview && (
        <NotFound entity="Cohort" type="NoData" />
      )}
    </div>
  );
};

export default Applicants;
