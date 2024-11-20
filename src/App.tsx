import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Error from "./components/Error";
import ProtectedLayout from "./components/layouts/ProtectedLayout";
import NotFound from "./pages/NotFound";
import Login from "./pages/User/Login";
import Profile from "./pages/User/Profile";
import TraineesInfo from "./pages/User/TraineesInfo";
import CoachesInfo from "./pages/User/CoachesInfo";
import ResetPassword from "./pages/User/ResetPassword";
import EditMyTrainees from "./pages/User/EditTraineesForCoach";
import AllForm from "./pages/Form/AllForms";
import SingleForm from "./pages/Form/SingleForm";
import OverView from "./pages/User/OverView";
import TraineeResults from "./pages/User/TraineeResults";
import ApplicantSignup from "./pages/Applicant/ApplicantSignup";
import ApplicantVerification from "./pages/Applicant/ApplicantVerification";
import ApplicationForm from "./pages/Applicant/ApplicationForm";
import ThankYouNote from "./pages/Applicant/ThankYouNote";
import Cohorts from "./pages/Cohort/Cohorts";
import HomePage from "./pages/Applicant/HomePage";
import SavedApplication from "./pages/Applicant/SavedApplication";
import Applicants from "./pages/User/Applicants";
import CreateApplicationForm from "./pages/Form/CreateApplicationForm";
import PrivateRoute from "./components/PrivateRoute";
import PreviewApplicationPage from "./pages/Applicant/PreviewApplicationPage";
import LoginSignup from "./pages/auth/LoginSignup";
import { Provider } from "react-redux";
import { store } from "./store";
import GlobalLayout from "./components/layouts/GlobalLayout";
import { UserRole } from "./utils/types";
import { CookiesProvider } from "react-cookie";

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route errorElement={<Error />}>
        <Route element={<GlobalLayout />}>
          <Route element={<ProtectedLayout />}>
            <Route element={<PrivateRoute allowedRoles={[UserRole.Admin]} />}>
              <Route index element={<div>Admin homepage</div>} />
              <Route path="/forms" element={<AllForm />} />
              <Route path="/forms/:id" element={<SingleForm />} />
              <Route
                path="/forms/create/application-form"
                element={<CreateApplicationForm />}
              />
              <Route path="/coaches" element={<CoachesInfo />} />
              <Route path="/cohorts" element={<Cohorts />} />
              <Route path="/applicants" element={<Applicants />} />
              <Route path="/trainees" element={<TraineesInfo />} />
            </Route>

            <Route element={<PrivateRoute allowedRoles={[UserRole.Coach]} />}>
              <Route path="/overview" element={<OverView />} />
              <Route path="/my-trainees" element={<EditMyTrainees />} />
              <Route path="/trainees-results" element={<TraineeResults />} />
            </Route>

            <Route
              element={
                <PrivateRoute
                  allowedRoles={[UserRole.Prospect, UserRole.Applicant]}
                />
              }
            >
              <Route path="/apply" element={<ApplicationForm />} />
              <Route path="/saved-application" element={<SavedApplication />} />
              <Route path="/preview" element={<PreviewApplicationPage />} />
              <Route path="/home" element={<HomePage />} />
            </Route>

            <Route
              element={
                <PrivateRoute
                  allowedRoles={[
                    UserRole.Prospect,
                    UserRole.Applicant,
                    UserRole.Coach,
                    UserRole.Admin,
                  ]}
                />
              }
            >
              <Route path="/profile-settings" element={<Profile />} />
            </Route>
          </Route>

          <Route path="/auth" element={<LoginSignup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<ApplicantSignup />} />
          <Route path="/signup/thank-you" element={<ThankYouNote />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify" element={<ApplicantVerification />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>,
    ),
  );

  return (
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </CookiesProvider>
  );
}
