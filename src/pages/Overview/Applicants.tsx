import {
  useGetApplicantsQuery,
  useGetAllCohortsQuery,
} from "../../features/user/backendApi";
import { AlertType, ButtonSize, Cohort, Cookie } from "../../utils/types";
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

const Applicants = () => {
  const [cookies] = useCookies([Cookie.jwt]);
  const { data: allCohorts } = useGetAllCohortsQuery({ jwt: cookies.jwt });
  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null);
  const dispatch = useDispatch();
  const {
    data: cohortOverview,
    error,
    isFetching,
  } = useGetApplicantsQuery({
    jwt: cookies.jwt,
    cohortId: selectedCohortId,
  });

  useEffect(() => {
    if (allCohorts) {
      const activeCohort = allCohorts.find(
        (cohort: Cohort) => cohort?.isActive,
      );
      if (activeCohort && !selectedCohortId) {
        setSelectedCohortId(activeCohort._id);
      }
    }
  }, [allCohorts, selectedCohortId]);

  if (error) {
    const { message } = getErrorInfo(error);
    handleShowAlert(dispatch, {
      type: AlertType.Error,
      message,
    });
  }

  const handleChange = (event: SelectChangeEvent) => {
    const newCohortId = event.target.value;
    setSelectedCohortId(newCohortId);
  };

  return (
    <div className="py-12 space-y-5">
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
                  <MenuItem key={cohort?._id} value={cohort?._id}>
                    {cohort?.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </div>
        <Button size={ButtonSize.Medium}>Add Applicant</Button>
      </div>
      {isFetching && <Loader />}
      {cohortOverview && <OverViewTable data={cohortOverview} />}
      {!isFetching && !cohortOverview && (
        <NotFound entity="Cohort" type="NoData" />
      )}
    </div>
  );
};

export default Applicants;
