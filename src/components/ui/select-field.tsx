import { ChevronDownIcon } from "@heroicons/react/16/solid";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type SelectFieldProps = Omit<ComponentPropsWithoutRef<"select">, "children"> & {
  error?: string;
  helper?: string;
  label: string;
  options: string[];
  placeholder?: string;
  showPlaceholder?: boolean;
  wrapperClassName?: string;
};

export function SelectField({
  className,
  error,
  helper,
  id,
  label,
  options,
  placeholder = "Select an option",
  required,
  showPlaceholder = true,
  wrapperClassName,
  ...props
}: SelectFieldProps) {
  const describedBy = error ? `${id}-error` : helper ? `${id}-help` : undefined;

  return (
    <div className={wrapperClassName}>
      <label htmlFor={id} className="block text-sm font-bold text-gray-950">
        {label}
        {required ? <span className="text-primary-600"> *</span> : null}
      </label>
      <div className="mt-2 grid grid-cols-1">
        <select
          id={id}
          required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn(
            "shadow-card col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2.5 pr-10 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-600 sm:text-sm/6",
            className,
          )}
          {...props}
        >
          {showPlaceholder ? <option value="">{placeholder}</option> : null}
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 mr-3 size-5 self-center justify-self-end text-gray-500 sm:size-4"
        />
      </div>
      {helper ? (
        <p id={`${id}-help`} className="mt-2 text-sm leading-6 text-gray-500">
          {helper}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
