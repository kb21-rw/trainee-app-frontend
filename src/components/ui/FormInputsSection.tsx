import React from "react";
import { UseFormRegister, FieldErrors, Control } from "react-hook-form";
import { ApplicationFormType } from "../../utils/types";
import classNames from "classnames";

interface Props {
  register: UseFormRegister<ApplicationFormType>;
  errors: FieldErrors<ApplicationFormType>;
  control: Control<ApplicationFormType>;
  activeInput: string;
}

export const FormInputsSection: React.FC<Props> = ({
  register,
  errors,
  activeInput,
}) => {
  return (
    <div
      className={classNames(
        "p-8 custom-shadow border-l-primary-light border-t-8 rounded-xl flex flex-col gap-5 flex-1",
        { "border-l-8 border-l-primary-light": activeInput === "title" },
      )}
    >
      <input
        placeholder="Enter title"
        className="outline-none text-[42px] font-bold border-b border-black"
        {...register("title")}
      />
      {errors.title && (
        <p className="text-red-400">Title should not be empty</p>
      )}
      <input
        placeholder="Enter description"
        className="outline-none border-b border-black"
        {...register("description")}
      />
      {errors.description && (
        <p className="text-red-400">Description should not be empty</p>
      )}
    </div>
  );
};
