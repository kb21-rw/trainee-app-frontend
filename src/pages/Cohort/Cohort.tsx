import React from 'react'
import { getJWT } from '../../utils/helper'
import { useGetAllCohortsQuery } from '../../features/user/apiSlice'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { ButtonSize } from '../../utils/types'
import Button from '../../components/ui/Button'
import CohortSkeleton from './CohortSkeleton'
import ActionButtons from './ActionButtons'
import SearchBar from './SearchBar'

type TCohort = {
  applicants: number
  coaches: number
  description: string
  forms: number
  name: string
  stages: number
  trainees: number
  _id: string
}
type TCohortWithId = TCohort & { readonly id: number }
const columns: GridColDef<TCohortWithId>[] = [
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
    field: 'trainees',
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

const customizeDataGridStyles = {
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

const Cohort = () => {
  const jwt: string = getJWT()
  const { data, isFetching: isGetAllCohorts } = useGetAllCohortsQuery({ jwt })

  let idCounter = 1
  const modifiedArray: TCohortWithId[] = data?.map((row: TCohort) => {
    return {
      ...row,
      id: idCounter++,
    }
  })

  if (isGetAllCohorts) return <CohortSkeleton />

  return (
    <div className='mt-20'>
      <div className='flex justify-between mb-10'>
        <SearchBar />
        <Button size={ButtonSize.Small}>Create cohort</Button>
      </div>
      <DataGrid
        rows={modifiedArray}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10]}
        disableColumnFilter
        disableColumnMenu
        disableRowSelectionOnClick
        sx={customizeDataGridStyles}
      />
    </div>
  )
}

export default Cohort
