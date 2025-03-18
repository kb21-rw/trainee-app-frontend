import {
  useCreateCohortMutation,
  useGetAllCohortsQuery,
} from "../../features/user/backendApi"
import { DataGrid } from "@mui/x-data-grid"
import Button from "../../components/ui/Button"
import { AlertType, ButtonSize, Cookie, Stage } from "../../utils/types"
import CreateCohortForm from "./CreateCohortForm"
import { Box, Modal, Typography } from "@mui/material"
import { useState } from "react"
import { handleShowAlert } from "../../utils/handleShowAlert"
import { useDispatch } from "react-redux"
import { getErrorInfo } from "../../utils/helper"
import { useCookies } from "react-cookie"
import { customizeDataGridStyles } from "../../utils/data"
import TableSkeleton from "../../components/skeletons/TableSkeleton"
import { GridColDef } from "@mui/x-data-grid"
import UpdateCohortModal from "../../components/modals/UpdateCohortModal"

type TCohort = {
  applicants: number
  coaches: number
  description: string
  forms: number
  name: string
  stages: Stage[]
  trainees: number
  _id: string
  trainingStartDate: string
}
type TCohortWithId = TCohort & { readonly id: string }

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  maxBlockSize: "80vh",
  overflowY: "auto",
}

export default function Cohorts() {
  const [cookies] = useCookies([Cookie.jwt])
  const [createCohort, { error, isSuccess }] = useCreateCohortMutation()
  const { data, isFetching } = useGetAllCohortsQuery({ jwt: cookies.jwt })
  const [open, setOpen] = useState(false)
  const [cohortToUpdate, setCohortToUpdate] = useState<{
    _id: string
    name: string
    description: string
    trainingStartDate: string
    stages: Stage[]
  } | null>(null)
  const dispatch = useDispatch()

  const modifiedArray: TCohortWithId[] = data?.map((row: TCohort) => {
    return {
      ...row,
      id: row._id,
    }
  })

  const columns: GridColDef<TCohortWithId>[] = [
    {
      field: "id",
      headerName: "No.",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "stages",
      headerName: "Stages",
      flex: 1,
      valueGetter: (value: Stage[]) => value.length,
    },
    {
      field: "applicants",
      headerName: "Participants",
      type: "number",
      align: "left",
      headerAlign: "left",
      flex: 1,
    },
    {
      field: "coaches",
      headerName: "Coaches",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      align: "center",
      headerAlign: "center",

      renderCell: ({ row }) => {
        return (
          <div className="flex items-center justify-center text-xs space-x-2 w-full h-full">
            <Button size={ButtonSize.Small} outlined>
              View
            </Button>
            <Button
              size={ButtonSize.Small}
              outlined
              onClick={() =>
                setCohortToUpdate({
                  _id: row.id,
                  name: row.name,
                  description: row.description,
                  trainingStartDate: row.trainingStartDate,
                  stages: row.stages,
                })
              }
            >
              Edit
            </Button>
          </div>
        )
      },
    },
  ]

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleResetCohortToUpdate = () => setCohortToUpdate(null)

  if (error) {
    const { message } = getErrorInfo(error)
    handleShowAlert(dispatch, {
      type: AlertType.Error,
      message,
    })
  }

  if (isFetching) return <TableSkeleton />

  if (isSuccess) {
    handleShowAlert(dispatch, {
      type: AlertType.Success,
      message: "Cohort was created successfully!",
    })
  }

  return (
    <div className="mt-10">
      <div className="flex justify-end mb-10">
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
          <Box sx={style}>
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
      {cohortToUpdate && (
        <UpdateCohortModal
          cohort={cohortToUpdate}
          onClose={handleResetCohortToUpdate}
        />
      )}
      <DataGrid
        rows={modifiedArray}
        columns={columns}
        disableRowSelectionOnClick
        sx={customizeDataGridStyles}
      />
    </div>
  )
}
