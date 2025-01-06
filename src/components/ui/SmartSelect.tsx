import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { useState } from "react";
import classNames from "classnames";
import { UseFormRegisterReturn } from "react-hook-form";
import DropDownIcon from "../../assets/DropDownIcon";

interface Option {
  value: string;
  label: string;
}

interface SmartSelectProps {
  options: Option[];
  defaultValue?: Option;
  label?: string;
  error?: string;
  register: UseFormRegisterReturn<any>;
}

export default function SmartSelect({
  options,
  defaultValue,
  error,
  label,
  register: { onChange, name },
}: SmartSelectProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(defaultValue ?? null);

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) => {
          return option.label.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <div className="bg-white space-y-2">
      {label && <label>{label}</label>}

      <Combobox
        value={selected}
        onChange={(option) => {
          setSelected(option);
          onChange({ target: { name, value: option?.value } });
        }}
        onClose={() => setQuery("")}
      >
        <div className="relative">
          <ComboboxInput
            className={classNames(
              "w-full p-3 border rounded-xl overflow-hidden focus:outline-none",
              { "border-gray-200": !error },
              { "border-red-500": error },
            )}
            displayValue={(option: Option | null) => option?.label ?? ""}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
          />
          <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
            <DropDownIcon className="w-5 h-5" />
          </ComboboxButton>
        </div>

        <ComboboxOptions
          anchor="bottom"
          transition
          className="relative z-[9999] w-[var(--input-width)] rounded-xl bg-white p-1 empty:invisible transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0 shadow-2xl"
        >
          {filteredOptions.map((option) => (
            <ComboboxOption
              key={option.value}
              value={option}
              className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-black/10 text-black"
            >
              <span className="text-sm/6">{option.label}</span>
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
}
