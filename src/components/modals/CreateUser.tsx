import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import { Modal } from "@mui/material";
import { AlertType, Cookie, CreateUserDto, UserRole } from "../../utils/types";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getErrorInfo } from "../../utils/helper";
import { handleShowAlert } from "../../utils/handleShowAlert";
import { useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
import { useCreateUserMutation } from "../../features/user/backendApi";

const selectOptions = [
  { value: UserRole.Prospect, label: "Prospect" },
  { value: UserRole.Coach, label: "Coach" },
  { value: UserRole.Admin, label: "Admin" },
];

const AddUserFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  role: z.enum([UserRole.Prospect, UserRole.Coach, UserRole.Admin]),
});

export default function CreateUser({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [cookies] = useCookies([Cookie.jwt]);
  const dispatch = useDispatch();
  const [
    createUser,
    {
      error: userError,
      isLoading: isUserLoading,
      isSuccess: isUserSuccess,
      reset: resetCreateUser,
    },
  ] = useCreateUserMutation();

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<CreateUserDto>({
    resolver: zodResolver(AddUserFormSchema),
    defaultValues: { name: "", email: "", role: UserRole.Prospect },
  });

  const onSubmit = async (formData: CreateUserDto) => {
    await createUser({ jwt: cookies.jwt, body: formData });
  };

  if (userError) {
    const { message } = getErrorInfo(userError);
    handleShowAlert(dispatch, {
      type: AlertType.Error,
      message,
    });
    resetCreateUser();
  }

  if (isUserSuccess) {
    handleShowAlert(dispatch, {
      type: AlertType.Success,
      message: "User was created successfully",
    });

    resetForm();
    resetCreateUser();
    onClose();
  }

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-describedby="Add user"
      component="div"
      className="max-w-md mx-auto flex items-center "
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-full bg-white p-5 rounded-xl"
      >
        <h1 className="text-center text-3xl font-semibold">Create user</h1>
        <Input
          register={{ ...register("name") }}
          label="Name"
          error={errors.name?.message}
        />
        <Input
          register={{ ...register("email") }}
          label="Email"
          error={errors.email?.message}
        />
        <Select
          options={selectOptions}
          label="Role"
          register={register("role")}
          error={errors.role?.message}
        />

        <div className="flex justify-around gap-2">
          <Button outlined onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit">{isUserLoading ? "..." : "Create"}</Button>
        </div>
      </form>
    </Modal>
  );
}
