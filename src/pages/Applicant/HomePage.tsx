import { Cookie } from "../../utils/types";
import { useGetMyApplicationQuery } from "../../features/user/backendApi";
import Loader from "../../components/ui/Loader";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useCookies } from "react-cookie";
import ApplicationFormActions from "../../components/applicationForm/ApplicationFormActions";

export default function HomePage() {
  const role = useSelector((state: RootState) => state.user.role)!;
  const [cookies] = useCookies([Cookie.jwt]);
  const { data: applicationForm, isLoading } = useGetMyApplicationQuery(
    cookies.jwt,
  );

  return (
    <div className="flex flex-col items-center justify-center mt-10 md:mt-20 space-y-10">
      <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-4 text-center">
        Welcome to The GYM&apos;s Application Portal
      </h1>
      {isLoading && (
        <div className="flex items-center justify-center w-full h-screen">
          <Loader />
        </div>
      )}

      <ApplicationFormActions applicationForm={applicationForm} role={role} />
    </div>
  );
}
