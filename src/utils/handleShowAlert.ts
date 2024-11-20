import { showAlert } from "../features/user/alertSlice";
import { Dispatch } from "react";
import { AnyAction } from "@reduxjs/toolkit";
import { AlertType } from "./types";

export const handleShowAlert = (
  dispatch: Dispatch<AnyAction>,
  {
    type,
    message,
    displayDuration,
  }: {
    type: AlertType;
    message: string;
    displayDuration?: number;
  }
) => {
  // Debounce the State Update
  setTimeout(() => {
    dispatch(
      showAlert({
        message,
        type,
        displayDuration,
      })
    );
  }, 0);
};
