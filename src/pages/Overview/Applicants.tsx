import {
  useGetApplicantsQuery,
  useGetAllCohortsQuery,
  useApplicantDecisionMutation,
} from "../../features/user/backendApi";
import {
  AlertType,
  ButtonSize,
  Cohort as BaseCohort,
  Cookie,
  DecisionInfo,
} from "../../utils/types";
import { useState, useEffect } from "react";
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

interface Cohort extends Pick<BaseCohort, "_id" | "name" | "description"> {}

const Applicants = () => {
  const [decisionInfo, setDecisionInfo] = useState<DecisionInfo | null>(null);
  const [cookies] = useCookies([Cookie.jwt]);
  const { data: allCohorts } = useGetAllCohortsQuery({ jwt: cookies.jwt });
  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null);
  const dispatch = useDispatch();
  const {
    data: cohortOverview,
    error: cohortOverviewError,
    isFetching,
  } = useGetApplicantsQuery({
    jwt: cookies.jwt,
    cohortId: selectedCohortId,
  });
  const [decide, { error: decisionError, isSuccess: decidingIsSuccess }] =
    useApplicantDecisionMutation();

  useEffect(() => {
    if (cohortOverview && !selectedCohortId) {
      setSelectedCohortId(cohortOverview._id);
    }
  }, [cohortOverview, selectedCohortId]);

  useEffect(() => {
    if (cohortOverviewError || decisionError) {
      const { message } = getErrorInfo(cohortOverviewError ?? decisionError);
      handleShowAlert(dispatch, {
        type: AlertType.Error,
        message,
      });
    }

    if (decidingIsSuccess) {
      handleShowAlert(dispatch, {
        type: AlertType.Success,
        message: `User is successfully ${decisionInfo?.decision.toLowerCase()}`,
      });
      setDecisionInfo(null);
    }
  }, [cohortOverviewError, decidingIsSuccess, decisionError, dispatch]); // decisionInfo?.decision is not included because it changes causing the useEffect to run on every re-render

  const handleChange = (event: SelectChangeEvent) => {
    const newCohortId = event.target.value;
    setSelectedCohortId(newCohortId);
  };

  const handleDecision = (userData: DecisionInfo) => {
    setDecisionInfo({ ...userData });
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

  return (
    <div className="py-12 space-y-5">
      <DecisionModal
        decisionInfo={decisionInfo}
        closeModal={() => setDecisionInfo(null)}
        onSubmit={handleSubmitDecision}
      />

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
      {isFetching && <Loader />}
      {cohortOverview && (
        <OverViewTable
          forms={cohortOverview.forms}
          participants={cohortOverview.applicants}
          stages={cohortOverview.applicationForm.stages}
          action={handleDecision}
        />
      )}
      {!isFetching && !cohortOverview && (
        <NotFound entity="Cohort" type="NoData" />
      )}
    </div>
  );
};

export default Applicants;
