import React from 'react'
import { getJWT } from '../../utils/helper'
import { useGetAllCohortsQuery } from '../../features/user/apiSlice'
import { DataGrid } from '@mui/x-data-grid'
import { ButtonSize } from '../../utils/types'
import Button from '../../components/ui/Button'
import CohortSkeleton from './CohortSkeleton'
import SearchBar from './SearchBar'
import {
  columns,
  customizeDataGridStyles,
  TCohort,
  TCohortWithId,
} from './cohortColumns'

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
    <div className='mt-10'>
      <div className='flex justify-between mb-10'>
        <SearchBar />
        <Button size={ButtonSize.Small}>Create cohort</Button>
      </div>
      <DataGrid
        rows={modifiedArray}
        columns={columns}
        hideFooter={true}
        disableColumnFilter
        disableColumnMenu
        disableRowSelectionOnClick
        sx={customizeDataGridStyles}
      />
    </div>
  )
}

export default Cohort
