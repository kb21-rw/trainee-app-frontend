import React, { ButtonHTMLAttributes, ReactNode } from "react";
import { ButtonSize, ButtonVariant } from "../../utils/types";
import classNames from "classnames";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  outlined?: boolean;
  size?: ButtonSize;
}

const Button = ({
  children,
  variant = ButtonVariant.Primary,
  outlined = false,
  size = ButtonSize.Medium,
  type = "button",
  disabled,
  onClick,
}: ButtonProps) => {
  const dangerClasses = {
    "text-red-500 bg-white border-red-500 border px-6":
      variant === ButtonVariant.Danger && outlined,
    "bg-red-500 text-white px-6": variant === ButtonVariant.Danger && !outlined,
  };

  const primaryClasses = {
    "text-primary-dark bg-white border-primary-dark border px-6":
      variant === ButtonVariant.Primary && outlined,
    "bg-primary-dark text-white":
      variant === ButtonVariant.Primary && !outlined,
  };

  const sizeClasses = {
    "px-4 py-1": size === ButtonSize.Small,
    "px-4 py-2": size === ButtonSize.Medium,
    "px-7 py-3 text-xl w-full": size === ButtonSize.Large,
  };

  return (
    <button
      onClick={onClick}
      className={classNames(
        "rounded-lg",
        dangerClasses,
        primaryClasses,
        sizeClasses,
      )}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
