import React, { useState } from "react"
import SearchInput from "../../components/ui/SearchInput"
import {
  useGetAllCohortsQuery,
  useGetAllFormsQuery,
  useGetApplicationFormQuery,
} from "../../features/user/backendApi"
import FormCard from "../../components/ui/FormCard"
import { Cookie, IFormType, AlertType, Cohort } from "../../utils/types"
import NotFound from "../../components/ui/NotFound"
import CreateFormDropdown from "../../components/ui/CreateFormDropdown"
import Loader from "../../components/ui/Loader"
import { Link } from "react-router-dom"
import FormsSkeleton from "./FormsSkeleton"
import { useCookies } from "react-cookie"
import { getErrorInfo } from "../../utils/helper"
import { handleShowAlert } from "../../utils/handleShowAlert"
import { useDispatch } from "react-redux"
import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material"

const AllForms = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const dispatch = useDispatch()
  const [cookies] = useCookies([Cookie.jwt])
  const { data, isFetching } = useGetAllFormsQuery({
    jwt: cookies.jwt,
    searchString: searchQuery,
  })
  const { data: applicationForm } = useGetApplicationFormQuery(cookies.jwt)

  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null)
  const handleCohortChange = (event: SelectChangeEvent) => {
    setSelectedCohortId(event.target.value)
  }

  const {
    data: cohorts,
    error: cohortsError,
    isFetching: cohortsAreFetching,
  } = useGetAllCohortsQuery({
    jwt: cookies.jwt,
  })

  if (cohortsError) {
    const { message } = getErrorInfo(cohortsError)
    handleShowAlert(dispatch, {
      type: AlertType.Error,
      message,
    })
  }

  const parsedApplicationForm = {
    _id: applicationForm?._id,
    name: applicationForm?.name,
    description: applicationForm?.description,
    type: applicationForm?.type,
    questions: applicationForm?.questions.length,
    startDate: applicationForm?.startDate,
  }
  const forms = data?.forms

  return (
    <div className="py-12">
      <div className="my-10 space-y-10">
        {cohortsAreFetching ? <Loader /> : null}
        <div className="flex justify-between items-center">
          <div className="w-52">
            <FormControl fullWidth>
              <Select
                labelId="cohort-label"
                id="single-select"
                defaultValue="Default"
                value={
                  selectedCohortId ??
                  (cohorts
                    ? cohorts.find((cohort: Cohort) => cohort.isActive)?._id
                    : "") ??
                  ""
                }
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
        </div>
      </div>
      {!isFetching && (
        <div className="flex justify-between items-center my-5">
          <SearchInput setSearchQuery={setSearchQuery} />
          <CreateFormDropdown
            applicationFormExists={Boolean(applicationForm)}
          />
        </div>
      )}
      {isFetching ? (
        <FormsSkeleton />
      ) : forms?.length === 0 && !applicationForm ? (
        <div className="flex w-screen h-[50vh]">
          <NotFound entity="Form" />
        </div>
      ) : (
        <div className="flex flex-col gap-4 py-4 px-[1px] md:container mx-auto w-3/5 h-[750px] overflow-scroll">
          {applicationForm && parsedApplicationForm ? (
            <FormCard form={parsedApplicationForm} />
          ) : (
            <div className="flex items-center space-x-1 text-lg rounded-md custom-shadow bg-white p-2">
              <span>Create a new</span>
              <Link
                to="/forms/create/application-form"
                className="text-primary-dark"
              >
                application form
              </Link>
            </div>
          )}
          {forms?.map((form: IFormType, index: number) => (
            <FormCard form={form} key={index} />
          ))}
        </div>
      )}
    </div>
  )
}

export default AllForms
