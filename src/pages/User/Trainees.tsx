import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
} from "@mui/x-data-grid"
import { useCookies } from "react-cookie"
import { useDispatch } from "react-redux"
import { useGetAllTraineesQuery } from "../../features/user/backendApi"
import { handleShowAlert } from "../../utils/handleShowAlert"
import { getErrorInfo } from "../../utils/helper"
import { AlertType, Cookie } from "../../utils/types"
import Button from "../../components/ui/Button"
import { customizeDataGridStyles } from "../../utils/data"
import EditIcon from "../../assets/EditIcon"
import SettingsIcon from "../../assets/SettingsIcon"

export default function Trainees() {
  const dispatch = useDispatch()
  const [cookies] = useCookies([Cookie.jwt])
  const { data, error, isFetching } = useGetAllTraineesQuery({
    jwt: cookies.jwt,
  })

  console.log(data)
  if (error) {
    const { message } = getErrorInfo(error)
    handleShowAlert(dispatch, {
      type: AlertType.Error,
      message,
    })
  }

  if (isFetching) {
    return <p>loading ...</p>
  }

  return (
    <div className="mt-4">
      <DataGrid
        sx={customizeDataGridStyles}
        columns={columns}
        rows={rows}
        getRowClassName={(params) => (!params.row.isActive ? "rejected" : "")}
      />
    </div>
  )
}

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    flex: 1,
    renderCell: (params: GridRenderCellParams) => (
      <div className="flex gap-2 justify-between">
        <p>{params.row.name}</p>
        <div className="flex gap-2">
          <button>
            <EditIcon />
          </button>
          <button>
            <SettingsIcon />
          </button>
        </div>
      </div>
    ),
  },
  {
    field: "coach",
    headerName: "Current coach",
    flex: 1,
  },
  {
    field: "stage",
    headerName: "Stage",
    flex: 1,
  },
  {
    field: "actions",
    headerName: "Actions",
    flex: 1,
    cellClassName: "actions-cell",
    renderCell: (params: GridRenderCellParams) =>
      params.row.isActive ? (
        <div className="flex gap-2">
          <Button className="flex items-center justify-center h-10 bg-red-500">
            Reject
          </Button>
          <Button className="flex items-center justify-center h-10">
            Accept
          </Button>
        </div>
      ) : (
        <p className="w-full text-center text-lg font-semibold">Rejected</p>
      ),
  },
]

const rows: GridRowsProp = [
  {
    id: "1",
    name: "Kevin Rebakure",
    coach: "Junior Mugisha",
    stage: "Stage 1 - Submit your CV",
    isActive: true,
  },
  {
    id: "2",
    name: "Alice Mukamana",
    coach: "Junior Mugisha",
    stage: "Stage 1 - Submit your CV",
    isActive: false,
  },
  {
    id: "3",
    name: "Eric Niyonsaba",
    coach: "Sophia Uwase",
    stage: "Stage 3 - Technical interview",
    isActive: true,
  },
  {
    id: "4",
    name: "Linda Ishimwe",
    coach: "Sophia Uwase",
    stage: "Stage 2 - Personal interview",
    isActive: false,
  },
  {
    id: "5",
    name: "Brian Habimana",
    coach: "Junior Mugisha",
    stage: "Stage 2 - Personal interview",
    isActive: true,
  },
]
