import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { adminMenu, applicantMenu, coachMenu } from "../../utils/data";
import { useGetProfileQuery } from "../../features/user/backendApi";
import { getJWT } from "../../utils/helper";
import Cookies from "universal-cookie";
import { UserRole } from "../../utils/types";
import Footer from "../ui/Footer";

const ProtectedLayout = () => {
  const jwt: string = getJWT();
  const cookies = new Cookies();
  const navigate = useNavigate();

  const { data } = useGetProfileQuery(jwt);
  const menu =
    (data?.role === UserRole.Admin && adminMenu) ||
    (data?.role === UserRole.Coach && coachMenu) ||
    (data?.role === UserRole.Applicant && applicantMenu) ||
    (data?.role === UserRole.Prospect && applicantMenu) ||
    [];

  return (
    <main className="max-h-screen font-lato max-w-[1920px] md:mx-auto overflow-x-hidden h-screen flex flex-col">
      <div>Helloooo....</div>
      <nav className="sticky top-0 flex items-center justify-between gap-20 py-6 px-1 md:px-16 bg-white border-b-2 shadow-b pr-20">
        <div className="flex items-center gap-10">
          {menu.map((element, index) => (
            <NavLink
              key={index}
              to={element.link}
              className={({ isActive }) =>
                `whitespace-nowrap text-xl font-medium ${
                  isActive ? "text-primary-dark" : "text-secondary-dark"
                }`
              }
              end={element.link === "/"}
            >
              {element.title}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-10">
          {
            <NavLink
              to="/profile-settings"
              className={({ isActive }) =>
                `whitespace-nowrap text-xl font-medium ${
                  isActive ? "text-primary-dark" : "text-secondary-dark"
                }`
              }
            >
              {data?.name}
            </NavLink>
          }
          <button
            className="text-xl font-medium text-secondary-dark"
            onClick={() => {
              cookies.remove("jwt");
              navigate("/login");
            }}
          >
            logout
          </button>
        </div>
      </nav>
      <div className="flex-1 px-1 md:px-16">
        <Outlet />
      </div>
      <Footer />
    </main>
  );
};

export default ProtectedLayout;
