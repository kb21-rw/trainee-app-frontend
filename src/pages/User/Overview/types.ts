import { GridRowId } from '@mui/x-data-grid'

export type TGroupData = {
  groupId: string
  headerName: string
  fields: Array<keyof TRowData>
}
export type TRowData = {
  id: GridRowId
  name: string
  coach: string
  stage: string
  jsSubmission?: string
  jsEffort?: string
  cssRate?: string
  cssFamiliarity?: string
  reactFamiliarity?: string
  htmlBasics?: string
  htmlAdvanced?: string
  somethingelse?: string
}
