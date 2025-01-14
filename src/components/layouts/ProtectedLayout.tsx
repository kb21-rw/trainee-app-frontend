import { NavLink, Outlet } from "react-router-dom"
import { adminMenu, applicantMenu, coachMenu } from "../../utils/data"

import { UserRole } from "../../utils/types"
import Footer from "../ui/Footer"
import { useSelector } from "react-redux"
import { RootState } from "../../store"
import useLogout from "../../utils/hooks/useLogout"

const ProtectedLayout = () => {
  const loggedInUser = useSelector((state: RootState) => state.user)
  const handleLogout = useLogout()

  const menu =
    (loggedInUser.role === UserRole.Admin && adminMenu) ||
    (loggedInUser.role === UserRole.Coach && coachMenu) ||
    (loggedInUser.role === UserRole.Applicant && applicantMenu) ||
    (loggedInUser.role === UserRole.Prospect && applicantMenu) ||
    []

  return (
    <>
      <nav className="sticky top-0 flex items-center justify-between gap-20 py-6 px-4 md:px-16 bg-white border-b-2 shadow-b z-40">
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
              {loggedInUser?.name}
            </NavLink>
          }
          <button
            className="text-xl font-medium text-secondary-dark"
            onClick={handleLogout}
          >
            logout
          </button>
        </div>
      </nav>
      <div className="flex-1 px-4 md:px-16">
        <Outlet />
      </div>
      <Footer />
    </>
  )
}

export default ProtectedLayout
