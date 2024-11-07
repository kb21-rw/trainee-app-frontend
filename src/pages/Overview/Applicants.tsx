import {
  useGetApplicantsQuery,
  useGetAllCohortsQuery,
} from "../../features/user/apiSlice";
import { getJWT } from "../../utils/helper";
import { AiOutlineWarning } from "react-icons/ai";
import { ButtonSize, Cohort } from "../../utils/types";
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

const Applicants = () => {
  const jwt: string = getJWT();
  const { data: allCohorts } = useGetAllCohortsQuery({ jwt });
  const [selectedCohortId, setSelectedCohortId] = useState<string>("");

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

  const {
    data: applicantsData,
    isError,
    isFetching,
  } = useGetApplicantsQuery(
    {
      jwt,
      cohortId: selectedCohortId,
    },
    {
      skip: !selectedCohortId,
    },
  );

  if (isError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-5">
          <AiOutlineWarning className="text-6xl text-yellow-500" />
          <h1 className="text-2xl">Error fetching applicants</h1>
        </div>
      </div>
    );
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
                value={selectedCohortId}
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
      {isFetching && <div>Loading applicants...</div>}
      {!isFetching && applicantsData?.length > 0 && (
        <OverViewTable data={applicantsData} />
      )}
      {!isFetching && applicantsData?.length == 0 && (
        <div>This Cohort is empty</div>
      )}
    </div>
  );
};

export default Applicants;
