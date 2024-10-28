import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Alert from "../ui/Alert";
import { Outlet } from "react-router-dom";

export default function GlobalLayout() {
  const alert = useSelector((state: RootState) => state.alert);
  return (
    <>
      {alert.isVisible && <Alert />}
      <Outlet />
    </>
  );
}
