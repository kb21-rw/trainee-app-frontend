import {
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material"
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
} from "@mui/x-data-grid"
import React from "react"
import { useCookies } from "react-cookie"
import { useDispatch } from "react-redux"
import EditIcon from "../../assets/EditIcon"
import SettingsIcon from "../../assets/SettingsIcon"
import Button from "../../components/ui/Button"
import {
  useGetAllTraineesQuery,
  useGetCoachesQuery,
} from "../../features/user/backendApi"
import { customizeDataGridStyles } from "../../utils/data"
import { handleShowAlert } from "../../utils/handleShowAlert"
import { getErrorInfo } from "../../utils/helper"
import { AlertType, Cookie } from "../../utils/types"

interface Coach {
  createdAt: string
  email: string
  googleId: null | string
  isOnWaitList: boolean
  name: string
  password: string
  role: string
  updatedAt: string
  userId: string
  verified: boolean
  _v: number
  _id: string
}
interface FetchCoachResponse {
  coaches: Coach[]
  isActive: boolean
  name: string
  _id: string
}
interface Trainee {
  coach: string
  id: string
  isActive: boolean
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  passedStages: any[]
  stage: string
  _id: string
}

export default function Trainees() {
  const dispatch = useDispatch()
  const [cookies] = useCookies([Cookie.jwt])
  const { data, error, isFetching } = useGetAllTraineesQuery({
    jwt: cookies.jwt,
    cohortId: "67ac6d7ce8e51e12d9acb526",
  })

  const trainees = data as Trainee[] | undefined
  console.log(trainees)

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
      renderCell: (params: GridRenderCellParams) =>
        params.row.isActive ? (
          <SelectCoach currentTrainee={params.row} />
        ) : (
          <p className="w-full font-semibold flex items-center h-full">
            No coach assigned
          </p>
        ),
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
        // rows={trainees}
        getRowClassName={(params) => (!params.row.isActive ? "rejected" : "")}
      />
    </div>
  )
}

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

const SelectCoach = ({ currentTrainee }: { currentTrainee: string }) => {
  const [cookies] = useCookies([Cookie.jwt])
  const { data, isFetching: fetchingCoaches } = useGetCoachesQuery({
    jwt: cookies.jwt,
  })

  const coaches = data as FetchCoachResponse | undefined

  console.log(coaches)
  console.log("Selected trainee" + currentTrainee)

  const [coach, setCoach] = React.useState("")

  const handleChange = (event: SelectChangeEvent) => {
    setCoach(event.target.value as string)
  }

  if (fetchingCoaches) return null

  return (
    <Box>
      <FormControl fullWidth>
        <Select
          value={coach}
          onChange={handleChange}
          displayEmpty
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
        >
          <MenuItem value="">
            <em>Select coach</em>
          </MenuItem>
          {coaches?.coaches.map((coach: Coach) => (
            <MenuItem key={coach.email} value={coach.name}>
              {coach.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}
