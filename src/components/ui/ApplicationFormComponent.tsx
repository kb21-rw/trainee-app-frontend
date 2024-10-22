/* eslint-disable no-unused-vars */

import React from "react";
import { Controller, useForm } from "react-hook-form";
import FormInput from "../../components/ui/FormInput";
import Button from "../../components/ui/Button";
import { ButtonVariant, Question, QuestionType } from "../../utils/types";

interface FormComponentProps {
  formTitle: string;
  formQuestions: Question[];
  handleFormSubmit: (formData: any) => void;
}

const FormComponent: React.FC<FormComponentProps> = ({
  formTitle,
  formQuestions,
  handleFormSubmit,
}) => {
  const { handleSubmit, register, control } = useForm();

  return (
    <form
      className="space-y-8 mt-6 p-6 bg-white shadow-md rounded-lg max-w-3xl mx-auto"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className="border-b border-gray-300 pb-4 mb-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          {formTitle}
        </h2>
      </div>

      {formQuestions.map((question: Question, index: number) => (
        <div key={index} className="space-y-4">
          <label className="block text-lg font-semibold text-gray-800">
            {index + 1}. {question.prompt}
          </label>

          {question.type === QuestionType.Text && (
            <FormInput
              {...register(`responses[${index}].questionId`, {
                value: question._id,
              })}
              {...register(`responses[${index}].answer`, { required: true })}
              className="border border-gray-300 rounded-md p-3 w-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          )}

          {question.type === QuestionType.SingleSelect && (
            <div className="space-y-3">
              {question.options?.map((option: string, optionIndex: number) => (
                <div key={optionIndex} className="flex items-center">
                  <input
                    type="radio"
                    id={`option_${index}_${optionIndex}`}
                    {...register(`responses[${index}].questionId`, {
                      value: question._id,
                    })}
                    {...register(`responses[${index}].answer`, {
                      required: true,
                    })}
                    value={option}
                    className="h-4 w-4 text-indigo-600 focus:ring-primary border-gray-300"
                  />
                  <label
                    htmlFor={`option_${index}_${optionIndex}`}
                    className="ml-3 text-sm font-medium text-gray-700"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          )}

          {question.type === QuestionType.MultiSelect && (
            <div className="space-y-3">
              <Controller
                name={`responses[${index}].answer`}
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <>
                    {question.options?.map((option: string, optionIndex: number) => (
                      <div key={optionIndex} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`option_${index}_${optionIndex}`}
                          value={option}
                          onChange={(e) => {
                            const newValue = e.target.checked
                              ? [...field.value, option]
                              : field.value.filter(
                                  (item: string) => item !== option
                                );
                            field.onChange(newValue);
                          }}
                          checked={field.value.includes(option)}
                          className="h-4 w-4 text-indigo-600 rounded focus:ring-primary border-gray-300"
                        />
                        <label
                          htmlFor={`option_${index}_${optionIndex}`}
                          className="ml-3 text-sm font-medium text-gray-700"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </>
                )}
              />
              <input
                type="hidden"
                {...register(`responses[${index}].questionId`, {
                  value: question._id,
                })}
              />
            </div>
          )}
        </div>
      ))}

      <div className="flex flex-col sm:flex-row justify-end sm:space-x-4 space-y-3 sm:space-y-0 mt-6">
        <Button
          outlined
          type="button"
          className="w-full sm:w-auto"
        >
          Save Draft
        </Button>
        <Button
          variant={ButtonVariant.Primary}
          type="submit"
          className="w-full sm:w-auto"
        >
          Review and Submit
        </Button>
      </div>
    </form>
  );
};

export default FormComponent;
