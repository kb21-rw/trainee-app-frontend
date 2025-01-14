import { InputHTMLAttributes, useState } from "react"
import OpenEye from "../../assets/OpenEyeIcon"
import ClosedEye from "../../assets/ClosedEyeIcon"
import { UseFormRegisterReturn } from "react-hook-form"
import classNames from "classnames"
import { Input as InputField } from "@headlessui/react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  register?: UseFormRegisterReturn<any>
  error?: string
}

export default function Input({
  id,
  type,
  label,
  disabled,
  placeholder,
  defaultValue,
  error,
  register,
}: InputProps) {
  const [show, setShow] = useState<boolean>(false)

  const inputType =
    type === "password" ? (show ? "text" : "password") : type ?? "text"

  const handleShowHidePassword = () => {
    setShow((prevShow) => !prevShow)
  }

  return (
    <div className="relative space-y-2">
      {label && <label htmlFor={id}>{label}</label>}
      <div
        className={classNames(
          "w-full border flex justify-between rounded-xl p-3",
          { "bg-gray-300": disabled },
          { "border-gray-200": !error },
          { "border-red-500": error },
        )}
      >
        <InputField
          type={inputType}
          className="outline-none border-none h-full flex-1 bg-transparent"
          placeholder={placeholder}
          defaultValue={defaultValue}
          disabled={disabled}
          {...register}
        />

        {type === "password" && (
          <button type="button" onClick={handleShowHidePassword}>
            {show ? <OpenEye /> : <ClosedEye />}
          </button>
        )}
      </div>
      {error && (
        <div className="absolute w-full text-xs text-red-500 -bottom-4 left-1">
          {error}
        </div>
      )}
    </div>
  )
}
