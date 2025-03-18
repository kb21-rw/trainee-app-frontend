import CheckMark from "../../assets/CheckMarkIcon";
import AddIcon from "../../assets/AddIcon";
import { Controller, useForm } from "react-hook-form";
import {
  useCreateQuestionMutation,
  useDeleteFormMutation,
  useEditFormMutation,
  useGetAllFormsQuery,
} from "../../features/user/backendApi";
import SuccessCheckMark from "../../assets/SuccessCheckMarkIcon";
import Delete from "../../assets/DeleteIcon";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import {
  AlertType,
  ApplicationForm,
  Cookie,
  Form,
  FormType,
  IFormType,
  QuestionType,
} from "../../utils/types";
import { useCookies } from "react-cookie";
import dayjs from "dayjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import UpdateStages from "./UpdateStages";
import { DatePicker } from "@mui/x-date-pickers";
import { getErrorInfo } from "../../utils/helper";
import { handleShowAlert } from "../../utils/handleShowAlert";
import { useDispatch } from "react-redux";

const FormDto = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  startDate: z
    .custom(
      (value) =>
        value === null || dayjs.isDayjs(value) || value instanceof Date,
      {
        message: "Start date must be a valid Date",
      }
    )
    .transform((value) => (dayjs.isDayjs(value) ? value.toDate() : value)),
  endDate: z
    .custom(
      (value) =>
        value === null || dayjs.isDayjs(value) || value instanceof Date,
      {
        message: "End date must be a valid Date",
      }
    )
    .transform((value) => (dayjs.isDayjs(value) ? value.toDate() : value)),
  stages: z
    .array(
      z.object({
        name: z.string().min(2, "Name is required"),
        description: z.string(),
      })
    )
    .optional(),
});

export type FormDtoSchema = z.infer<typeof FormDto>;

interface UpdateFormProps {
  form: ApplicationForm | Form;
  readonly?: boolean;
}

export default function EditableFormCard({ form, readonly = false }: UpdateFormProps) {
  const defaultValues = {
    name: form.name,
    description: form.description ?? "",
    startDate:
      form.type === FormType.Application ? dayjs(form.startDate) : null,
    endDate: form.type === FormType.Application ? dayjs(form.endDate) : null,
    stages: form.type === FormType.Application ? form.stages : [],
  };

  const [cookies] = useCookies([Cookie.jwt]);
  const dispatch = useDispatch();
  const {
    control,
    register,
    handleSubmit,
    formState: { isDirty, dirtyFields, errors },
  } = useForm<FormDtoSchema>({
    resolver: zodResolver(FormDto),
    defaultValues,
  });

  const [editForm] = useEditFormMutation();
  const [createQuestion] = useCreateQuestionMutation();
  const navigate = useNavigate();
  const {data: allForms} = useGetAllFormsQuery({ jwt: cookies.jwt })
  const allFormsData = allForms?.forms
  

  const [deleteForm, { isLoading: isDeleteFormLoading }] =
    useDeleteFormMutation();
  const handleDeleteForm = async () => {
    await deleteForm({ jwt: cookies.jwt, _id: form._id });
    navigate(`/forms`);
  };

  const onSubmit = async (data: FormDtoSchema) => {
    if (readonly) return;

    if (allFormsData) {
      const duplicateTitle = allFormsData.find((form: IFormType) => form.name === data.name);
      if (duplicateTitle) {
        handleShowAlert(dispatch, {
          type: AlertType.Error,
          message: "A form with the same title already exists",
        });
        return;
      }
     
    }

    const requestBody: Partial<FormDtoSchema> = {};
    for (const key in dirtyFields) {
      const myKey = key as keyof FormDtoSchema;
      if (!dirtyFields[myKey]) continue;
      requestBody[myKey] = data[myKey] as any;
    }

    try {
      const result = await editForm({
        jwt: cookies.jwt,
        id: form._id,
        body: requestBody,
      });

      if (result.error) {
        throw result.error;
      }

      handleShowAlert(dispatch, {
        type: AlertType.Success,
        message: "Form updated successfully",
      });

      navigate(`/forms/${result?.data?._id}`);
    } catch (error) {
      const { message } = getErrorInfo(error);
      handleShowAlert(dispatch, {
        type: AlertType.Error,
        message,
      });
    }
  };

  const handleAddQuestion = async () => {
    if (readonly) return;
    await createQuestion({
      jwt: cookies.jwt,
      formId: form._id,
      body: { prompt: `Question`, type: QuestionType.Text },
    });
  };

  return (
    <form className="flex gap-2 group" onSubmit={handleSubmit(onSubmit)}>
      {isDeleteFormLoading && (
        <div className="absolute inset-0 w-full h-full">
          <Loader />
        </div>
      )}
      <div className="flex flex-col flex-1 gap-8 p-8 border-t-8 custom-shadow border-t-primary-dark group-focus-within:border-t-primary-light rounded-xl">
        <input
          placeholder="Enter title"
          className={`outline-none text-[42px] font-bold border-b border-black/10 ${
            readonly ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
          {...register("name")}
          disabled={readonly}
        />
        <input
          placeholder="Enter description"
          className={`outline-none border-b border-black/10 ${
            readonly ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
          {...register("description")}
          disabled={readonly}
        />
        {form.type === FormType.Application && (
          <>
            <div className="flex justify-between">
              <Controller
                name="startDate"
                control={control}
                render={({ field, ...props }) => (
                  <DatePicker
                    value={field.value ?? null}
                    onChange={readonly ? undefined : field.onChange}
                    label="Application open date"
                    {...props}
                    disabled={readonly}
                  />
                )}
              />
              <Controller
                name="endDate"
                control={control}
                render={({ field, ...props }) => (
                  <DatePicker
                    value={field.value ?? null}
                    onChange={readonly ? undefined : field.onChange}
                    label="Application close date"
                    {...props}
                    disabled={readonly}
                  />
                )}
              />
            </div>
            <UpdateStages
              control={control}
              register={register}
              error={errors}
              readOnly={readonly}
            />
          </>
        )}
      </div>
      {!readonly && (
        <div className="flex flex-col justify-between gap-6 p-4 max-h-48 custom-shadow rounded-xl">
          {isDirty ? (
            <button type="submit">
              <SuccessCheckMark />
            </button>
          ) : (
            <CheckMark />
          )}
          <button type="button" onClick={handleAddQuestion}>
            <AddIcon />
          </button>
          <button type="button" onClick={handleDeleteForm}>
            <Delete />
          </button>
        </div>
      )}
    </form>
  );
}
