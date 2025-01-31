import { InputLabel, Paper, Stack, TextField } from "@mui/material"
import Button from "../../components/ui/Button"
import {
  ButtonSize,
  ButtonVariant,
  Stage as BaseStage,
} from "../../utils/types"
import {
  Control,
  Controller,
  useFieldArray,
  UseFormRegister,
} from "react-hook-form"
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react"
import DropDownIcon from "../../assets/DropDownIcon"

type Stage = Omit<BaseStage, "id" | "participantsCount"> & {
  id?: string
  participantsCount?: number
}

type UpdateStageProps = {
  control: Control<{ stages: Stage[]; [key: string]: any }>
  register?: UseFormRegister<any>
  error: any
}

export default function UpdateStages({ control, error }: UpdateStageProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "stages",
  })

  const handleAddStage = () => {
    append({ name: "", description: "", participantsCount: 0 })
  }

  const handleRemoveStage = () => {
    const lastStage = fields[fields.length - 1]
    if (lastStage?.participantsCount === 0) {
      remove(fields.length - 1)
    }
  }

  return (
    <Disclosure as="div" className="p-4 border rounded-md">
      <DisclosureButton className="w-full flex items-center justify-between">
        <h1 className="text-2xl">Stages</h1>
        <DropDownIcon className="w-8 h-8" />
      </DisclosureButton>
      <DisclosurePanel className="mt-6">
        {fields.map((field, index) => (
          <Paper
            key={field.id}
            sx={{ p: 2, mb: 2, borderRadius: 2 }}
            elevation={5}
          >
            <Controller
              control={control}
              name={`stages.${index}.name`}
              render={({ field }) => (
                <>
                  <InputLabel shrink htmlFor="bootstrap-input">
                    Name
                  </InputLabel>
                  <TextField
                    sx={{ paddingBlockEnd: 2 }}
                    error={!!error.stages?.[index]?.name}
                    helperText={error.stages?.[index]?.name?.message}
                    {...field}
                    size="small"
                    fullWidth
                    placeholder={`Stage ${index + 1} Name`}
                  />
                </>
              )}
            />
            <Controller
              control={control}
              name={`stages.${index}.description`}
              render={({ field }) => (
                <>
                  <InputLabel shrink htmlFor="bootstrap-input">
                    Description
                  </InputLabel>
                  <TextField
                    error={!!error.stages?.[index]?.description}
                    helperText={error.stages?.[index]?.description?.message}
                    {...field}
                    size="small"
                    fullWidth
                    placeholder={`Stage ${index + 1} Description`}
                  />
                </>
              )}
            />
          </Paper>
        ))}
        <Stack
          direction="row"
          display="flex"
          justifyContent="space-between"
          paddingBlockStart={1}
        >
          {fields?.[fields.length - 1]?.participantsCount === 0 &&
            fields.length > 1 && (
              <Button
                size={ButtonSize.Small}
                variant={ButtonVariant.Danger}
                onClick={handleRemoveStage}
                disabled={fields.length === 1}
              >
                Remove Stage
              </Button>
            )}
          <Button size={ButtonSize.Small} onClick={handleAddStage}>
            Add Stage
          </Button>
        </Stack>
      </DisclosurePanel>
    </Disclosure>
  )
}
