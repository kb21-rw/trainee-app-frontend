import { useState } from "react"
import {
  useGetAllCohortsQuery,
  useGetCoachesQuery,
} from "../../features/user/backendApi"
import Button from "../../components/ui/Button"
import { AlertType, ButtonSize, Cohort, Cookie, User } from "../../utils/types"
import { useCookies } from "react-cookie"
import { useDispatch } from "react-redux"
import { FormControl, SelectChangeEvent, MenuItem, Select } from "@mui/material"
import { handleShowAlert } from "../../utils/handleShowAlert"
import { getErrorInfo } from "../../utils/helper"
import Loader from "../../components/ui/Loader"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
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
  const [cookies] = useCookies([Cookie.jwt])
  const {
    data: cohorts,
    error: cohortsError,
    isFetching: cohortsAreFetching,
  } = useGetAllCohortsQuery({
    jwt: cookies.jwt,
  })

  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null)

  const {
    data: cohortCoaches,
    error: cohortCoachesError,
    isFetching: cohortCoachesIsFetching,
  } = useGetCoachesQuery({
    jwt: cookies.jwt,
    cohortId: selectedCohortId,
  })
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

  if (cohortsError || cohortCoachesError || cohortCoachesError) {
    const { message } = getErrorInfo(cohortsError ?? cohortCoachesError)
    handleShowAlert(dispatch, {
      type: AlertType.Error,
      message,
    })
  }

  const columns: GridColDef[] = [
    {
      field: "userId",
      headerName: "UserId",
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

  const rows: { id: string; userId: string; name: string; email: string }[] =
    cohortCoaches?.coaches?.map((coach: User) => ({
      id: coach._id,
      userId: coach.userId,
      name: coach.name,
      email: coach.email,
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
                value={selectedCohortId ?? cohortCoaches?._id ?? ""}
                onChange={handleCohortChange}
              >
                {cohorts?.map((cohort: Cohort) => (
                  <MenuItem key={cohort._id} value={cohort._id}>
                    {cohort.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          {cohortCoaches?.isActive && (
            <Button
              size={ButtonSize.Medium}
              onClick={() => setIsAddCoachOpen(true)}
            >
              Add coach
            </Button>
          )}
        </div>
        <DataGrid
          columns={columns}
          rows={rows}
          hideFooter
          sx={customizeDataGridStyles}
        />
      </div>
    </>
  )
}
