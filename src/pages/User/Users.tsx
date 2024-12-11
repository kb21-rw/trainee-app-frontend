import { useGetUsersQuery } from "../../features/user/backendApi";
import Button from "../../components/ui/Button";
import {
  AlertType,
  ButtonSize,
  Cookie,
  User,
  UserRole,
} from "../../utils/types";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { handleShowAlert } from "../../utils/handleShowAlert";
import { getErrorInfo } from "../../utils/helper";
import Loader from "../../components/ui/Loader";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "../../assets/EditIcon";

export default function Users() {
  const dispatch = useDispatch();
  const [cookies] = useCookies([Cookie.jwt]);
  const {
    data: users,
    error: usersError,
    isFetching: usersIsFetching,
  } = useGetUsersQuery({
    jwt: cookies.jwt,
  });

  if (usersError) {
    const { message } = getErrorInfo(usersError);
    handleShowAlert(dispatch, {
      type: AlertType.Error,
      message,
    });
  }

  if (usersIsFetching) {
    return <Loader />;
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
      renderCell: () => {
        return (
          <div className="flex justify-center justify-items-center h-full gap-4">
            <button>
              <EditIcon />
            </button>
          </div>
        );
      },
    },
  ];

  const rows = users.map((user: User) => ({
    id: user._id,
    userId: user.userId,
    name: user.name,
    email: user.email,
    role: user.role,
  }));

  return (
    <div className="my-10 space-y-10">
      <div className="flex justify-end items-center">
        <Button size={ButtonSize.Medium}>Add user</Button>
      </div>
      <DataGrid columns={columns} rows={rows} />
    </div>
  );
}
