import { GridColDef } from "@mui/x-data-grid"
import ActionButtons from "./ActionButtons"

export type TCohort = {
  applicants: number
  coaches: number
  description: string
  forms: number
  name: string
  stages: number
  trainees: number
  _id: string
}
export type TCohortWithId = TCohort & { readonly id: number }
export const columns: GridColDef<TCohortWithId>[] = [
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

    renderCell: () => {
      return <ActionButtons />
    },
  },
]
