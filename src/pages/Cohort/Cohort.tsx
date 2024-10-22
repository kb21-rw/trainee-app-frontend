import { getJWT } from '../../utils/helper'
import { useGetAllCohortsQuery } from '../../features/user/apiSlice'
import { DataGrid } from '@mui/x-data-grid'
import CohortSkeleton from './CohortSkeleton'
import SearchBar from './SearchBar'
import {
  columns,
  customizeDataGridStyles,
  TCohort,
  TCohortWithId,
} from './cohortColumns'
import CreateCohortModal from './CreateCohortModal'

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
        <CreateCohortModal />
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
