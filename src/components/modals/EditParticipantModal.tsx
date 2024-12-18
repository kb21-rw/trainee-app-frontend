import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import { Modal } from "@mui/material";
import { useCookies } from "react-cookie";
import { AlertType, Cookie, User } from "../../utils/types";
import { useUpdateParticipantMutation } from "../../features/user/backendApi";
import { useDispatch } from "react-redux";
import { getErrorInfo } from "../../utils/helper";
import { handleShowAlert } from "../../utils/handleShowAlert";
import Select from "../ui/Select";
import Input from "../ui/Input";

export default function EditParticipantModal({
  row,
  coaches,
  onClose,
}: {
  row: any;
  coaches: User[];
  onClose: () => void;
}) {
  const [cookies] = useCookies([Cookie.jwt]);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<{ name: string; coach: string }>();
  const [updateParticipant, { error, isSuccess }] =
    useUpdateParticipantMutation();
  const dispatch = useDispatch();

  const coachOptions = [
    { value: "", label: "Select a coach" },
    ...coaches.map((coach) => ({
      value: coach._id,
      label: coach.name,
    })),
  ];

  const onSubmit = async (formData: { name: string; coach: string }) => {
    await updateParticipant({
      jwt: cookies.jwt,
      body: formData,
      participantId: row.id,
    });
  };

  if (error) {
    const { message } = getErrorInfo(error);
    handleShowAlert(dispatch, {
      type: AlertType.Error,
      message,
    });
    onClose();
  }

  if (isSuccess) {
    handleShowAlert(dispatch, {
      type: AlertType.Success,
      message: "Response was added successfully",
    });
    onClose();
  }

  return (
    <Modal
      open={Boolean(row.id)}
      onClose={onClose}
      aria-labelledby="Edit Participant"
      aria-describedby=""
      component="div"
      className="max-w-md mx-auto flex items-center "
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-full bg-white p-5 rounded-xl"
      >
        <h1 className="text-center text-3xl font-semibold">Edit participant</h1>
        <Input
          type="text"
          label="Name"
          defaultValue={row?.name ?? ""}
          register={{ ...register("name", { required: "Name is required" }) }}
          error={errors.name?.message}
        />
        <Select
          label="Coach"
          defaultValue={row?.coach ?? ""}
          options={coachOptions}
          register={{ ...register("coach") }}
          error={errors.coach?.message}
        />
        <div className="flex justify-around gap-2">
          <Button outlined onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit">Confirm</Button>
        </div>
      </form>
    </Modal>
  );
}
