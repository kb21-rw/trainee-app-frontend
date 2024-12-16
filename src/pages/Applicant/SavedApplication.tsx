import { useCookies } from "react-cookie";
import { AlertType, Cookie, UserResponseQuestion } from "../../utils/types";
import { useGetMyApplicationQuery } from "../../features/user/backendApi";
import Loader from "../../components/ui/Loader";
import { getErrorInfo } from "../../utils/helper";
import { handleShowAlert } from "../../utils/handleShowAlert";
import { useDispatch } from "react-redux";
import ApplicationFormQuestionPreview from "../../components/ui/ApplicationFormQuestionPreview";
import { Link } from "react-router-dom";

export default function SavedApplication() {
  const [cookies] = useCookies([Cookie.jwt]);
  const dispatch = useDispatch();
  const {
    data: application,
    isFetching,
    error,
  } = useGetMyApplicationQuery(cookies.jwt);

  if (isFetching || !application) return <Loader />;

  if (error) {
    const { message } = getErrorInfo(error);
    handleShowAlert(dispatch, { type: AlertType.Error, message });
  }

  return (
    <div className="my-12 items-center justify-center flex flex-col p-5 custom-shadow border-t-primary-dark border-t-8 rounded-xl">
      <div className="p-4 text-center">
        <h1 className="font-bold text-xl sm:text-4xl">{application.name}</h1>
      </div>
      <div className="mb-8 p-4 rounded-t-xl md:w-4/5 w-full">
        {application.questions.map(
          (question: UserResponseQuestion, index: number) => (
            <ApplicationFormQuestionPreview
              key={question._id}
              question={question}
              index={index + 1}
            />
          ),
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <Link
          className="bg-primary-dark text-white px-6 py-3 rounded-md"
          to="/home"
        >
          Back to home page
        </Link>
      </div>
    </div>
  );
}
