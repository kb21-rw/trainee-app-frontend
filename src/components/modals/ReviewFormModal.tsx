import React from "react";
import { ApplicationFormResponse, Question, QuestionType } from "../../utils/types";
import Button from "../../components/ui/Button";
import ModalLayout from "./ModalLayout";
import EditIcon from "../../assets/EditIcon";

const ReviewFormModal = ({
  title,
  closePopup,
  formQuestions,
  responses,
  handleConfirm,
  handleEdit,
}: {
  title: string;
  closePopup: () => void;
  formQuestions: Question[];
  responses: ApplicationFormResponse[];
  setReviewData: React.Dispatch<
    React.SetStateAction<ApplicationFormResponse[]>
  >;
  handleConfirm: () => void;
  handleEdit: () => void;
}) => {
  console.log(responses);

  return (
    <ModalLayout title={title} closePopup={closePopup}>
      <div className="bg-white rounded-lg shadow-sm px-8">
        <div className="mb-8">
          {formQuestions.map((question, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {index + 1}. {question.prompt}
              </h3>
              {question.type === QuestionType.Text && (
                <p className="text-gray-600 pl-3">
                  {responses[index]?.answer}
                </p>
              )}
              {question.type === QuestionType.SingleSelect && (
                <ul className="list-disc list-inside text-gray-600 pl-3">
                  <li>{responses[index]?.answer}</li>
                </ul>
              )}
              {question.type === QuestionType.MultiSelect && (
                <ul className="list-disc list-inside text-gray-600 pl-3">
                  {responses[index]?.answer.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-4">
          <Button onClick={handleEdit} outlined >
            <span className="flex items-center space-x-2">
              <EditIcon /> Edit
            </span>
          </Button>
          <Button
            onClick={() => {
              handleConfirm();
              closePopup();
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default ReviewFormModal;
