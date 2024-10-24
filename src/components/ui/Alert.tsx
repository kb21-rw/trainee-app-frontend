import classNames from "classnames";
import React, { ReactNode, useEffect } from "react";

const Alert = ({
  children,
  type,
  displayDuration = 5000,
  open,
  onClose,
}: {
  children: ReactNode;
  type: "error" | "success";
  displayDuration?: number;
  open: boolean;
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, displayDuration);
    return () => clearTimeout(timer);
  }, [displayDuration, onClose]);

  return (
    open && (
      <div
        className={classNames(
          "w-alert-width py-2 flex justify-center items-center rounded-lg absolute top-24 left-1/2 -translate-x-1/2 border-green-600",
          { "bg-error-light text-error-dark": type === "error" },
          { "bg-green-300 text-white": type === "success" }
        )}
      >
        {children}
      </div>
    )
  );
};

export default Alert;
