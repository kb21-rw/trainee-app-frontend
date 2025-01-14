import { useState } from "react"
import SuccessCheckMarkIcon from "../../assets/SuccessCheckMarkIcon"
import CheckMarkIcon from "../../assets/CheckMarkIcon"
import { AlertType, ApplicationFormType, Cookie } from "../../utils/types"
import { useApplicationForm } from "../../utils/hooks/useApplicationForm"
import { FormInputsSection } from "../../components/ui/FormInputsSection"
import { StagesSection } from "../../components/ui/StagesSection"
import { useCreateFormMutation } from "../../features/user/backendApi"
import FormDateInputs from "../../components/ui/FormDateInput"
import useNavigateAfterSuccess from "../../utils/hooks/useNavigateAfterSuccess"

import moment from "moment"

import { getErrorInfo } from "../../utils/helper"
import { handleShowAlert } from "../../utils/handleShowAlert"
import { useDispatch } from "react-redux"
import { useCookies } from "react-cookie"

const CreateApplicationForm = () => {
  const [cookies] = useCookies([Cookie.jwt])
  const [activeInput, setActiveInput] = useState("")
  const [createForm, { error, isSuccess }] = useCreateFormMutation()
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    control,
    errors,
    isDirty,
    currentStages,
    addStagesHandler,
    addNewStage,
    removeStage,
  } = useApplicationForm()

  useNavigateAfterSuccess("/forms", isSuccess)

  const onSubmit = async (data: ApplicationFormType) => {
    const requestBody = {
      name: data.title,
      description: data.description,
      type: "Application",
      startDate: moment(data.startDate).format("YYYY-MM-DD"),
      endDate: moment(data.endDate).format("YYYY-MM-DD"),
      stages: data.stages,
    }
    await createForm({
      jwt: cookies.jwt,
      body: requestBody,
    })
  }

  if (error) {
    const { message } = getErrorInfo(error)
    handleShowAlert(dispatch, {
      type: AlertType.Error,
      message,
    })
  }

  if (isSuccess) {
    handleShowAlert(dispatch, {
      type: AlertType.Success,
      message: "Form was created successfully!",
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onFocus={() => setActiveInput("title")}
      className="w-full flex justify-center gap-5 mt-10"
    >
      <div className="w-4/5 px-4 space-y-5">
        <FormInputsSection
          register={register}
          control={control}
          errors={errors}
          activeInput={activeInput}
        />
        <div className="border p-8 px-4 space-y-6 rounded-xl">
          <div className="flex items-center gap-20">
            <FormDateInputs control={control} errors={errors} />
          </div>
          <StagesSection
            currentStages={currentStages}
            addStagesHandler={addStagesHandler}
            addNewStage={addNewStage}
            removeStage={removeStage}
            register={register}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 p-4 custom-shadow rounded-xl h-1/2">
        {isDirty ? (
          <button type="submit">
            <SuccessCheckMarkIcon />
          </button>
        ) : (
          <CheckMarkIcon />
        )}
      </div>
    </form>
  )
}

export default CreateApplicationForm
