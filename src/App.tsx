import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom"
import Error from "./components/Error"
import ProtectedLayout from "./components/layouts/ProtectedLayout"
import NonProtectedLayout from "./components/layouts/NonProtectedLayout"
import NotFound from "./pages/NotFound"
import Profile from "./pages/User/Profile"
import CoachesInfo from "./pages/User/Coaches"
import ResetPassword from "./pages/auth/ResetPassword"
import AllForm from "./pages/Form/AllForms"
import SingleForm from "./pages/Form/Form"
import OverView from "./pages/User/OverView"
import TraineeResults from "./pages/User/TraineeResults"
import ApplicantVerification from "./pages/auth/Verification"
import ApplicationForm from "./pages/Applicant/ApplicationForm"
import ThankYouNote from "./pages/Applicant/ThankYouNote"
import Cohorts from "./pages/Cohort/Cohorts"
import HomePage from "./pages/Applicant/HomePage"
import SavedApplication from "./pages/Applicant/SavedApplication"
import Applicants from "./pages/Overview/Applicants"
import PrivateRoute from "./components/PrivateRoute"
import PreviewApplicationPage from "./pages/Applicant/PreviewApplicationPage"
import Auth from "./pages/auth/Auth"
import { Provider } from "react-redux"
import { store } from "./store"
import GlobalLayout from "./components/layouts/GlobalLayout"
import { UserRole } from "./utils/types"
import { CookiesProvider } from "react-cookie"
import Users from "./pages/User/Users"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { googleClientId } from "./utils/constants"

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route errorElement={<Error />}>
        <Route element={<GlobalLayout />}>
          <Route element={<ProtectedLayout />}>
            <Route element={<PrivateRoute allowedRoles={[UserRole.Admin]} />}>
              <Route path="/users" element={<Users />} />
              <Route path="/forms" element={<AllForm />} />
              <Route path="/forms/:id" element={<SingleForm />} />
              <Route path="/coaches" element={<CoachesInfo />} />
              <Route path="/cohorts" element={<Cohorts />} />
              <Route path="/applicants" element={<Applicants />} />
              <Route path="/trainees" element={<h1>Trainees Overview...</h1>} />
            </Route>

            <Route element={<PrivateRoute allowedRoles={[UserRole.Coach]} />}>
              <Route path="/overview" element={<OverView />} />
              <Route path="/my-trainees" element={<h1>My trainees</h1>} />
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

          <Route element={<NonProtectedLayout />}>
            <Route path="/auth" element={<Auth />} />
            <Route path="/signup/thank-you" element={<ThankYouNote />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify" element={<ApplicantVerification />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>,
    ),
  )

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <CookiesProvider defaultSetOptions={{ path: "/" }}>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <RouterProvider router={router} />
          </LocalizationProvider>
        </Provider>
      </CookiesProvider>
    </GoogleOAuthProvider>
  )
}
