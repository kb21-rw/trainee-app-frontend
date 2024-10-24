import React, { useState } from "react";
import SearchInput from "../../components/ui/SearchInput";
import {
  useGetAllFormsQuery,
  useGetApplicationFormQuery,
} from "../../features/user/apiSlice";
import FormCard from "../../components/ui/FormCard";
import { IFormType } from "../../utils/types";
import NotFound from "../../components/ui/NotFound";
import { getJWT } from "../../utils/helper";
import CreateFormDropdown from "../../components/ui/CreateFormDropdown";
import { Link } from "react-router-dom";
import FormsSkeleton from "./FormsSkeleton";

const AllForms = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const jwt: string = getJWT();
  const { data, isFetching } = useGetAllFormsQuery({
    jwt,
    searchString: searchQuery,
  });
  const { data: applicationForm } = useGetApplicationFormQuery(jwt);

  const parsedApplicationForm = {
    _id: applicationForm?._id,
    name: applicationForm?.name,
    description: applicationForm?.description,
    type: applicationForm?.type,
    questions: applicationForm?.questions.length,
    startDate: applicationForm?.startDate,
  };
  const forms = data?.forms;

  return (
    <div className="py-12">
      {isFetching ? (
        <FormsSkeleton />
      ) : forms?.length === 0 && !applicationForm ? (
        <div className="flex w-screen h-[50vh]">
          <NotFound type="Form" />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center my-5">
            <SearchInput setSearchQuery={setSearchQuery} />
            <CreateFormDropdown />
          </div>
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
        </>
      )}
    </div>
  );
};

export default AllForms;
