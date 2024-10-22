import React, { useState } from "react";
import { useGetMyApplicationQuery } from "../../features/user/apiSlice";
import Loader from "../../components/ui/Loader";
import { ApplicationFormResponse } from "../../utils/types";
import ReviewFormModal from "../../components/modals/ReviewFormModal";
import ApplicantSuccessModal from "../../components/modals/ApplicationSuccess";
import { useAddApplicantResponseMutation } from "../../features/user/apiSlice";
import { getJWT } from "../../utils/helper";
import ApplicationFormComponent from "../../components/ui/ApplicationFormComponent";

const ApplicationForm = () => {
  const [reviewData, setReviewData] = useState<ApplicationFormResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmissionSuccessful, setIsSubmissionSuccessful] = useState(false);

  const jwt: string = getJWT();
  const { data, isFetching } = useGetMyApplicationQuery(jwt);
  const [addApplicantResponse, { isSuccess }] =
    useAddApplicantResponseMutation();

  const formTitle = data?.name;
  const formQuestions = data?.questions ?? [];

  const handleFormSubmit = (formData: any) => {
    const responses = formData.responses.map(
      (response: ApplicationFormResponse) => ({
        questionId: response.questionId,
        answer: response.answer ? response.answer : [response.answer],
      }),
    );

    console.log(formData);
    setReviewData(responses);
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    try {
      await addApplicantResponse({ jwt, body: reviewData, action: "submit" });
      if (isSuccess) setIsSubmissionSuccessful(true);
    } catch (error: any) {
      throw new Error("Error submitting form", error);
    }
  };

  const handleEdit = () => {
    setReviewData([]);
    setIsModalOpen(false);
  };

  if (isFetching)
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="mt-5 flex items-center justify-center py-6 px-4 sm:py-12 sm:px-6 lg:px-8 border h-screen">
      <div className="w-full md:max-w-3xl bg-white rounded-lg shadow-lg border border-green-500">
        <div className="border-t-[#673AB7] border-t-8 rounded-xl w-full p-2 sm:p-4 "></div>
        <div className="px-4 py-4 sm:px-8 sm:py-6 border border-red-500">
          <ApplicationFormComponent
            formTitle={formTitle}
            formQuestions={formQuestions}
            handleFormSubmit={handleFormSubmit}
          />
        </div>
      </div>

      {isModalOpen && (
        <ReviewFormModal
          title="Confirm Submission"
          closePopup={() => setIsModalOpen(false)}
          formQuestions={formQuestions}
          responses={reviewData}
          setReviewData={setReviewData}
          handleConfirm={handleConfirm}
          handleEdit={handleEdit}
        />
      )}
      {isSubmissionSuccessful && (
        <ApplicantSuccessModal
          closePopup={() => setIsSubmissionSuccessful(false)}
        />
      )}
    </div>
  );
};

export default ApplicationForm;
