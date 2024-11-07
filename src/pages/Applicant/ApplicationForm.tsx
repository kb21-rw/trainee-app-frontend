/* eslint-disable no-unused-vars */

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useGetMyApplicationQuery } from "../../features/user/backendApi";
import Loader from "../../components/ui/Loader";
import { ApplicationFormResponse } from "../../utils/types";
import { getJWT } from "../../utils/helper";
import ApplicationFormComponent from "../../components/ui/ApplicationFormComponent";

const ApplicationForm = () => {
  const  location = useLocation();
  const [formData, setFormData] = useState(location?.state || {})
  const jwt: string = getJWT();
  const navigate = useNavigate();

  const { data, isFetching } = useGetMyApplicationQuery(jwt);

  const formTitle = data?.name;
  const formQuestions = data?.questions ?? [];

  const handleFormSubmit = (formData: any) => {
    const responses = formData.responses.map(
      (response: ApplicationFormResponse) => ({
        questionId: response.questionId,
        answer: response.answer ? response.answer : [response.answer],
      }),
    );

    navigate('/preview', {state: {formQuestions, responses, formTitle, formData}})
  };

  if (isFetching)
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full py-4 flex flex-col items-center md:w-1/2">
        <div className="md:w-4/5 border rounded-xl">
        <div className="border-t-[#673AB7] border-t-8 rounded-xl p-2 sm:p-4 w-full"></div>
          <ApplicationFormComponent
            formTitle={formTitle}
            formQuestions={formQuestions}
            handleFormSubmit={handleFormSubmit}
            initialFormData={formData}
          />
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
