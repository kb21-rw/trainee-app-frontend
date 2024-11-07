import {
  useCreateCohortMutation,
  useGetAllCohortsQuery,
} from "../../features/user/backendApi";
import { DataGrid } from "@mui/x-data-grid";
import CohortSkeleton from "./CohortSkeleton";
import SearchBar from "./SearchBar";
import {
  columns,
  customizeDataGridStyles,
  TCohort,
  TCohortWithId,
} from "./cohortColumns";
import Button from "../../components/ui/Button";
import { AlertType, ButtonSize } from "../../utils/types";
import CreateCohortForm from "./CreateCohortForm";
import { Box, Modal, Typography } from "@mui/material";
import { useState } from "react";
import { handleShowAlert } from "../../utils/handleShowAlert";
import { useDispatch } from "react-redux";
import { getErrorInfo, getJWT } from "../../utils/helper";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function Cohorts() {
  const jwt: string = getJWT();
  const [createCohort, { error, isSuccess }] = useCreateCohortMutation();
  const { data, isFetching } = useGetAllCohortsQuery({ jwt });
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  let idCounter = 1;
  const modifiedArray: TCohortWithId[] = data?.map((row: TCohort) => {
    return {
      ...row,
      id: idCounter++,
    };
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (error) {
    const { message } = getErrorInfo(error);
    handleShowAlert(dispatch, {
      type: AlertType.Error,
      message,
    });
  }

  if (isFetching) return <CohortSkeleton />;

  if (isSuccess) {
    handleShowAlert(dispatch, {
      type: AlertType.Success,
      message: "Cohort was created successfully!",
    });
  }

  return (
    <div className="mt-10">
      <div className="flex justify-between mb-10">
        <SearchBar />
        <Button onClick={handleOpen} size={ButtonSize.Small}>
          Create cohort
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{ paddingInline: 10 }}
        >
          <Box sx={{ ...style, maxBlockSize: "80vh", overflowY: "auto" }}>
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h2"
              sx={{ textAlign: "center", fontWeight: "bold" }}
            >
              Create a new Cohort
            </Typography>
            <CreateCohortForm
              handleClose={handleClose}
              createCohort={createCohort}
            />
          </Box>
        </Modal>
      </div>
      <DataGrid
        rows={modifiedArray}
        columns={columns}
        hideFooter={true}
        disableColumnFilter
        disableColumnMenu
        disableRowSelectionOnClick
        sx={customizeDataGridStyles}
      />
    </div>
  );
}
