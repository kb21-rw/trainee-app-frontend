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
import { DataGrid, GridColDef, GridRowClassNameParams } from "@mui/x-data-grid"
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
    refetch,
  } = useGetUsersQuery({
    jwt: cookies.jwt,
  })

  const getRowClassName = (params: GridRowClassNameParams) => {
    const row = params.row as User
    // If the user is an admin or a coach and is inactive, apply grey styling
    return (row.role === UserRole.Admin || row.role === UserRole.Coach) &&
      !row.active
      ? "bg-gray-200"
      : ""
  }

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
          <div className="flex h-full gap-4">
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
        active: user.active,
      })) ?? []

  return (
    <>
      <CreateUser
        isOpen={isCreateUserModalOpen}
        onClose={handleCloseCreateUserModal}
      />
      <div className="my-10 space-y-10">
        <div className="flex items-center justify-end">
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
              onClose={() => {
                setTimeout(() => setUserInformation(null), 0)
                // Refresh data after updating a user
                refetch()
              }}
            />
          </>
        )}
        <DataGrid
          columns={columns}
          rows={rows}
          sx={customizeDataGridStyles}
          getRowClassName={getRowClassName}
        />
      </div>
    </>
  )
}
