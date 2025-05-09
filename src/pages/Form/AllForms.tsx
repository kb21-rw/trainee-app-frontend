import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import { useDispatch } from "react-redux"
import CreateFormDropdown from "../../components/ui/CreateFormDropdown"
import FormCard from "../../components/ui/FormCard"
import Loader from "../../components/ui/Loader"
import NotFound from "../../components/ui/NotFound"
import SearchInput from "../../components/ui/SearchInput"
import {
  useGetAllCohortsQuery,
  useGetAllFormsQuery,
  useGetApplicationFormQuery,
} from "../../features/user/backendApi"
import { handleShowAlert } from "../../utils/handleShowAlert"
import { getErrorInfo } from "../../utils/helper"
import { AlertType, Cohort, Cookie, IFormType } from "../../utils/types"
import FormsSkeleton from "./FormsSkeleton"
import { useLocation } from "react-router-dom"

const AllForms = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const dispatch = useDispatch()
  const [cookies] = useCookies([Cookie.jwt])
  const [hasFetched, setHasFetched] = useState(false)
  const { activeCohortId } = useLocation().state || {}
  const [selectedCohortId, setSelectedCohortId] = useState<string | undefined>(
    () => activeCohortId,
  )

  const { data, isFetching } = useGetAllFormsQuery({
    jwt: cookies.jwt,
    searchString: searchQuery,
    cohort: selectedCohortId,
  })

  const { data: applicationForm } = useGetApplicationFormQuery(cookies.jwt)

  const handleCohortChange = (event: SelectChangeEvent<string>) => {
    setSelectedCohortId(event.target.value)
  }

  const {
    data: cohorts,
    error: cohortsError,
    isFetching: cohortsAreFetching,
  } = useGetAllCohortsQuery(
    {
      jwt: cookies.jwt,
    },
    { skip: !hasFetched },
  )

  useEffect(() => {
    setHasFetched(true)
  }, [])

  useEffect(() => {
    if (cohorts && cohorts.length > 0 && !selectedCohortId) {
      const activeCohort = cohorts.find((cohort: Cohort) => cohort.isActive)
      if (activeCohort) {
        setSelectedCohortId(activeCohort._id)
      }
    }
  }, [cohorts, selectedCohortId])

  if (cohortsError) {
    const { message } = getErrorInfo(cohortsError)
    handleShowAlert(dispatch, {
      type: AlertType.Error,
      message,
    })
  }

  const forms = data?.forms

  return (
    <div className="py-12">
      <div className="my-10 space-y-10">
        {cohortsAreFetching && <Loader />}
        <div className="flex justify-between items-center">
          <div className="w-52">
            <FormControl fullWidth>
              <Select
                labelId="cohort-label"
                id="single-select"
                value={selectedCohortId ?? ""}
                onChange={handleCohortChange}
                displayEmpty
                renderValue={(selected) => {
                  if (!cohorts || cohorts.length === 0) {
                    return <em>No Cohorts Available</em>
                  }

                  const selectedCohort = cohorts.find(
                    (cohort: Cohort) => cohort._id === selected,
                  )
                  return selectedCohort ? selectedCohort.name : ""
                }}
              >
                {cohorts && cohorts.length > 0 ? (
                  cohorts.map((cohort: Cohort) => (
                    <MenuItem key={cohort._id} value={cohort._id}>
                      {cohort.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>
                    <em>No Cohorts Available</em>
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
      {isFetching && <FormsSkeleton />}

      {!isFetching && (
        <div className="flex justify-between items-center my-5">
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <CreateFormDropdown
            applicationFormExists={Boolean(applicationForm)}
          />
        </div>
      )}

      {!isFetching && forms?.length === 0 ? (
        <NotFound entity="Form" />
      ) : (
        forms?.map((form: IFormType, index: number) => (
          <FormCard form={form} key={index} activeCohortId={selectedCohortId} />
        ))
      )}
    </div>
  )
}

export default AllForms
