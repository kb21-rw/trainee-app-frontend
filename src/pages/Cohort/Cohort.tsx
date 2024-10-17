import React from 'react'
// import UserTableHeader from '../../components/ui/UserTableHeader'
// import { cohortTableDataItems } from '../../utils/data'
import Button from '../../components/ui/Button'
// import PlusIcon from '../../assets/PlusIcon'
// import { getCohorts, getJWT } from '../../utils/helper'
// import AddingCohortModal from '../../components/modals/AddingCohort'
// import UserTable from '../../components/ui/UserTable'
// import { useGetAllCohortsQuery } from '../../features/user/apiSlice'

import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Box, InputBase } from '@mui/material'
import { ButtonSize } from '../../utils/types'

const columns: GridColDef<(typeof rows)[number]>[] = [
  {
    field: 'id',
    headerName: 'No.',
    sortable: false,
    align: 'center',
    headerAlign: 'center',
    headerClassName: 'header-background',
  },
  {
    field: 'firstName',
    headerName: 'Name',
    flex: 1,
    sortable: false,
    align: 'center',
    headerAlign: 'center',
    headerClassName: 'header-background',
  },
  {
    field: 'lastName',
    headerName: 'Stages',
    flex: 1,
    sortable: false,
    align: 'center',
    headerAlign: 'center',
    headerClassName: 'header-background',
  },
  {
    field: 'age',
    headerName: 'Current participants',
    type: 'number',
    flex: 1,
    sortable: false,
    align: 'center',
    headerAlign: 'center',
    headerClassName: 'header-background',
  },
  {
    field: 'fullName',
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
      return (
        <div className='flex items-center justify-center space-x-2 w-full h-full'>
          <Button size={ButtonSize.Small} outlined className='text-xs'>
            View
          </Button>
          <Button size={ButtonSize.Small} outlined className='text-xs'>
            Edit
          </Button>
        </div>
      )
    },
  },
]

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
]
const Cohort = () => {
  return (
    <div className='mt-20'>
      <div className='flex justify-between mb-10'>
        <Box
          component='form'
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: 400,
            border: '1px solid #b4bacb',
            borderRadius: '8px',
            paddingBlock: '2px',
            paddingInlineEnd: '2px',
          }}
        >
          <InputBase
            sx={{ ml: 2, flex: 1 }}
            placeholder='Enter name'
            inputProps={{ 'aria-label': 'Enter name' }}
          />
          <Button size={ButtonSize.Small} className='text-sm'>
            Search
          </Button>
        </Box>
        <Button size={ButtonSize.Small}>Create cohort</Button>
      </div>
      <DataGrid
        rows={rows}
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
        sx={{
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
        }}
      />
    </div>
  )
}

export default Cohort
