import { useState, useEffect } from "react"
import {
  useGetAllCohortsQuery,
  useGetCoachesQuery,
} from "../../features/user/backendApi"
import { AlertType, Cohort, User } from "../../utils/types"
import { useDispatch } from "react-redux"
import { FormControl, SelectChangeEvent, MenuItem, Select } from "@mui/material"
import { handleShowAlert } from "../../utils/handleShowAlert"
import { getErrorInfo } from "../../utils/helper"
import Loader from "../../components/ui/Loader"
import { DataGrid, GridColDef, GridRowClassNameParams } from "@mui/x-data-grid"
import AddCoach from "../../components/modals/AddCoach"
import EditIcon from "../../assets/EditIcon"
import EditCoach from "../../components/modals/EditCoachModal"
import { customizeDataGridStyles } from "../../utils/styles"

export default function Coaches() {
  const [isAddCoachOpen, setIsAddCoachOpen] = useState(false)
  const [coachState, setCoachState] = useState({
    isEditCoachOpen: false,
    selectedCoachName: "",
    selectedEmail: "",
    selectedCoachId: "",
  })
  const updateCoachState = (newState: Partial<typeof coachState>) => {
    setCoachState((prevState) => ({ ...prevState, ...newState }))
  }

  const dispatch = useDispatch()
  const {
    data: cohorts,
    error: cohortsError,
    isFetching: cohortsAreFetching,
  } = useGetAllCohortsQuery()

  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null)

  // Here we are trying to set the default selected cohort. It's important for a good UX.
  useEffect(() => {
    if (cohorts && cohorts.length > 0 && !selectedCohortId) {
      setSelectedCohortId(cohorts[0]._id)
    }
  }, [cohorts, selectedCohortId])

  const {
    data: cohortCoaches,
    error: cohortCoachesError,
    isFetching: cohortCoachesIsFetching,
  } = useGetCoachesQuery(
    {
      cohortId: selectedCohortId,
    },
    {
      // Skipping the query if selectedCohortId is null
      skip: !selectedCohortId,
    },
  )

  const handleCohortChange = (event: SelectChangeEvent) => {
    const cohortId = event.target.value
    setSelectedCohortId(cohortId)
  }

  const handleEditCoach = (name: string, email: string, id: string) => {
    updateCoachState({
      isEditCoachOpen: true,
      selectedCoachName: name,
      selectedEmail: email,
      selectedCoachId: id,
    })
  }

  if (cohortsError || cohortCoachesError) {
    const { message } = getErrorInfo(cohortsError ?? cohortCoachesError)
    handleShowAlert(dispatch, {
      type: AlertType.Error,
      message,
    })
  }

  const getRowClassName = (params: GridRowClassNameParams) => {
    const row = params.row as User
    return !row.active ? "bg-gray-200" : ""
  }

  const columns: GridColDef[] = [
    {
      field: "userId",
      headerName: "No.",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: ({ row }) => {
        return (
          <div className="flex items-center h-full gap-12 justify-items-center">
            <button
              onClick={() => handleEditCoach(row.name, row.email, row.id)}
            >
              <EditIcon />
            </button>
          </div>
        )
      },
    },
  ]

  const rows: {
    id: string
    userId: string
    name: string
    email: string
    active: boolean
  }[] =
    cohortCoaches?.coaches?.map((coach: User, index: number) => ({
      id: coach._id,
      userId: index + 1,
      name: coach.name,
      email: coach.email,
      active: coach.active,
    })) ?? []

  return (
    <>
      {isAddCoachOpen && (
        <AddCoach
          isOpen={isAddCoachOpen}
          onClose={() => setTimeout(() => setIsAddCoachOpen(false), 0)}
          cohortCoachIds={rows.map((coach) => coach.id)}
        />
      )}
      {coachState.isEditCoachOpen && (
        <EditCoach
          isOpen={coachState.isEditCoachOpen}
          onClose={() => updateCoachState({ isEditCoachOpen: false })}
          currentName={coachState.selectedCoachName}
          currentEmail={coachState.selectedEmail}
          coachId={coachState.selectedCoachId}
        />
      )}
      <div className="my-10 space-y-10">
        {(cohortsAreFetching || cohortCoachesIsFetching) && <Loader />}
        <div className="flex items-center justify-between">
          <div className="w-52">
            <FormControl fullWidth>
              <Select
                labelId="cohort-label"
                id="single-select"
                value={selectedCohortId || ""}
                onChange={handleCohortChange}
                displayEmpty
              >
                {cohorts?.map((cohort: Cohort) => (
                  <MenuItem key={cohort._id} value={cohort._id}>
                    {cohort.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <DataGrid
          columns={columns}
          rows={rows}
          hideFooter
          sx={customizeDataGridStyles}
          getRowClassName={getRowClassName}
        />
      </div>
    </>
  )
}
