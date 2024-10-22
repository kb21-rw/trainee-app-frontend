import { GridColDef } from '@mui/x-data-grid'
import ActionButtons from './ActionButtons'

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
    field: 'id',
    headerName: 'No.',
    sortable: false,
    align: 'center',
    headerAlign: 'center',
    headerClassName: 'header-background',
  },
  {
    field: 'name',
    headerName: 'Name',
    flex: 1,
    sortable: false,
    align: 'center',
    headerAlign: 'center',
    headerClassName: 'header-background',
  },
  {
    field: 'stages',
    headerName: 'Stages',
    flex: 1,
    sortable: false,
    align: 'center',
    headerAlign: 'center',
    headerClassName: 'header-background',
  },
  {
    field: 'applicants',
    headerName: 'Current participants',
    type: 'number',
    flex: 1,
    sortable: false,
    align: 'center',
    headerAlign: 'center',
    headerClassName: 'header-background',
  },
  {
    field: 'coaches',
    headerName: 'Coaches',
    flex: 1,
    sortable: false,
    align: 'center',
    headerAlign: 'center',
    headerClassName: 'header-background',
  },
  {
    field: 'actions',
    headerName: 'Actions',
    flex: 1,
    sortable: false,
    align: 'center',
    headerAlign: 'center',
    headerClassName: 'header-background',
    renderCell: () => {
      return <ActionButtons />
    },
  },
]
export const customizeDataGridStyles = {
  border: 'none',
  '& .MuiDataGrid-row': {
    borderBottom: '1px solid #000000',
  },
  '& .header-background': {
    backgroundColor: '#CCE4F0',
    fontWeight: 'bold',
    fontSize: '18px',
    border: 'none',
  },
  '& .MuiDataGrid-columnSeparator': {
    display: 'none',
  },
  '& .MuiDataGrid-cell:focus': {
    outline: 'none',
  },
}
