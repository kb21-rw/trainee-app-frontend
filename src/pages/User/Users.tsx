import { useGetUsersQuery } from "../../features/user/backendApi"
import Button from "../../components/ui/Button"
import {
  AlertType,
  ButtonSize,
  Cookie,
  User,
  UserRole,
} from "../../utils/types"
import { useCookies } from "react-cookie"
import { useDispatch } from "react-redux"
import { handleShowAlert } from "../../utils/handleShowAlert"
import { getErrorInfo } from "../../utils/helper"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import EditIcon from "../../assets/EditIcon"
import { useState } from "react"
import CreateUser from "../../components/modals/CreateUser"
import { customizeDataGridStyles } from "../../utils/data"
import TableSkeleton from "../../components/skeletons/TableSkeleton"
import EditUserModal from "../../components/modals/EditUserModal"

export default function Users() {
  const dispatch = useDispatch()
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false)
  const [userInformation, setUserInformation] = useState<User | null>(null)
  const [cookies] = useCookies([Cookie.jwt])
  const {
    data: users,
    error: usersError,
    isFetching: usersIsFetching,
  } = useGetUsersQuery({
    jwt: cookies.jwt,
  })

  const columns: GridColDef[] = [
    {
      field: "userId",
      headerName: "UserId",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      type: "singleSelect",
      valueOptions: [
        UserRole.Prospect,
        UserRole.Applicant,
        UserRole.Trainee,
        UserRole.Coach,
        UserRole.Admin,
      ],
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: ({ row }) => {
        return (
          <div className="flex justify-center justify-items-center h-full gap-4">
            <button onClick={() => setUserInformation(row)}>
              <EditIcon />
            </button>
          </div>
        )
      },
    },
  ]

  const handleCloseCreateUserModal = () =>
    setTimeout(() => setIsCreateUserModalOpen(false), 0)

  if (usersError) {
    const { message } = getErrorInfo(usersError)
    handleShowAlert(dispatch, {
      type: AlertType.Error,
      message,
    })
  }

  if (usersIsFetching) return <TableSkeleton />

  const rows =
    [...users]
      .sort((a: User, b: User) => b.createdAt.localeCompare(a.createdAt))
      ?.map((user: User) => ({
        id: user._id,
        _id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
      })) ?? []

  return (
    <>
      <CreateUser
        isOpen={isCreateUserModalOpen}
        onClose={handleCloseCreateUserModal}
      />
      <div className="my-10 space-y-10">
        <div className="flex justify-end items-center">
          <Button
            size={ButtonSize.Medium}
            onClick={() => setIsCreateUserModalOpen(true)}
          >
            Create user
          </Button>
        </div>
        {userInformation && (
          <>
            <EditUserModal
              isOpen={Boolean(userInformation)}
              defaultValues={userInformation}
              onClose={() => setTimeout(() => setUserInformation(null), 0)}
            />
          </>
        )}
        <DataGrid columns={columns} rows={rows} sx={customizeDataGridStyles} />
      </div>
    </>
  )
}
