import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { hideAlert } from "../../features/user/alertSlice";
import { AlertType } from "../../utils/types";

const Alert = () => {
  const alert = useSelector((stage: RootState) => stage.alert);
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(hideAlert());
    }, alert.displayDuration);
    return () => clearTimeout(timer);
  }, [alert.displayDuration, dispatch]);

  return (
    alert.isVisible && (
      <div
        className={`w-alert-width py-2 flex justify-center items-center rounded-lg absolute top-14 left-1/2 -translate-x-1/2 z-50 border-green-600 ${
          alert.type === AlertType.Error && "bg-error-light text-error-dark"
        } ${alert.type === AlertType.Success && "bg-green-300 text-white"}`}
      >
        {alert.message}
      </div>
    )
  );
};

export default Alert;
