import React, { useState } from "react";
import OpenEye from "../../assets/OpenEyeIcon";
import ClosedEye from "../../assets/ClosedEyeIcon";
import { FieldErrors } from "react-hook-form";
import classNames from "classnames";

const InputField = ({
  label,
  type,
  placeholder,
  name,
  defaultValue,
  register,
  options,
  errorMessage,
  errors,
  disabled = false,
}: {
  label: string;
  type: string;
  placeholder?: string;
  name: string;
  defaultValue?: string;
  register?: any;
  options?: any;
  errorMessage?: any;
  errors?: FieldErrors;
  disabled?: boolean;
}) => {
  const [show, setShow] = useState<boolean>(false);
  const passwordIcon = () => {
    return show ? <OpenEye /> : <ClosedEye />;
  };

  const fieldErrorMessage = name && errors && errors[name]?.message;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={label} className="text-lg font-medium">
        {label}
      </label>
      <div
        className={classNames(
          "w-full border border-gray-200 flex justify-between rounded-xl p-3",
          { "bg-gray-300": disabled },
        )}
      >
        <input
          type={show ? "text" : type}
          name={name}
          className="outline-none border-none h-full flex-1 bg-transparent"
          placeholder={placeholder}
          defaultValue={defaultValue}
          disabled={disabled}
          {...(register && { ...register(name, options) })}
        />
        {(fieldErrorMessage || errorMessage) && (
          <div className="w-full text-sm text-red-500 absolute -top-7">
            {(fieldErrorMessage || errorMessage).toString()}
          </div>
        )}

        {type === "password" && (
          <button type="button" onClick={() => setShow(!show)}>
            {passwordIcon()}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;
