import { SelectHTMLAttributes } from "react"
import { Select as SelectField } from "@headlessui/react"
import { UseFormRegisterReturn } from "react-hook-form"
import classNames from "classnames"

interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  options: { value: string; label: string }[]
  register?: UseFormRegisterReturn<any>
  label?: string
  error?: string
  value?: string
  onValueChange?: (_value: string) => void
}

export default function Select({
  id,
  label,
  options,
  register,
  error,
  defaultValue,
  value,
  onValueChange,
  ...props
}: SelectProps) {
  return (
    <div className="relative space-y-2">
      {label && <label htmlFor={id}>{label}</label>}
      <div
        className={classNames(
          " w-full p-3 border rounded-xl overflow-hidden",
          { "border-gray-200": !error },
          { "border-red-500": error },
        )}
      >
        <SelectField
          className="flex justify-between w-full focus:outline-none"
          {...(register
            ? register
            : {
                value,
                onChange: onValueChange
                  ? (e: React.ChangeEvent<HTMLSelectElement>) =>
                      onValueChange(e.target.value)
                  : undefined,
              })}
          defaultValue={defaultValue}
          {...props}
        >
          {options.map((option) => (
            <option key={option.label} value={option.value.toString()}>
              {option.label}
            </option>
          ))}
        </SelectField>
        {error && (
          <div className="absolute w-full text-red-500 text-4 -bottom-4 left-1">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
