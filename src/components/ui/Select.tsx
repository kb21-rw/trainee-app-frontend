import { SelectHTMLAttributes } from "react";
import { Select as SelectField } from "@headlessui/react";
import { UseFormRegisterReturn } from "react-hook-form";
import classNames from "classnames";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  register?: UseFormRegisterReturn<any>;
  label?: string;
  error?: string;
}

export default function Select({
  id,
  label,
  options,
  register,
  error,
}: SelectProps) {
  return (
    <div className="space-y-2">
      {label && <label htmlFor={id}>{label}</label>}
      <div
        className={classNames(
          "w-full p-3 border rounded-xl overflow-hidden",
          { "border-gray-200": !error },
          { "border-red-500": error },
        )}
      >
        <SelectField
          className="w-full flex justify-between focus:outline-none"
          {...register}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>
        {error && (
          <div className="w-full text-sm text-red-500 absolute -top-7">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
