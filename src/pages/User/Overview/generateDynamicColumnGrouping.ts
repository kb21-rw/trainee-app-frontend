import { GridColDef } from '@mui/x-data-grid'
import { TGroupData, TRowData } from './types'

export const generateDynamicColumnGroupingModel = (
  groupData: TGroupData[],
  columns: GridColDef<TRowData>[]
) => {
  return groupData.map((group) => ({
    groupId: group.groupId,
    headerName: group.headerName,
    align: 'center',
    children: group.fields
      .filter((field) => columns.some((col) => col.field === field))
      .map((field) => ({ field })),
  }))
}
