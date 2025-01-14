import { InputLabel, Paper, Stack, TextField, Typography } from "@mui/material"
import Button from "../../components/ui/Button"
import { ButtonSize, ButtonVariant } from "../../utils/types"
import { Controller, UseFormRegister, useFieldArray } from "react-hook-form"

type StageProps = {
  stagesNames?: { stageName: string; stageDescription: string }
  control: any
  register?: UseFormRegister<any>
  errors: any
}

function Stages({ control, errors }: StageProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "stages",
  })

  const addStage = () => {
    append({ stageName: "", stageDescription: "" })
  }

  const removeStage = (index: number) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  return (
    <>
      <Typography marginBlock={2}>Stages</Typography>
      {fields.map((field, index) => (
        <Paper
          key={field.id}
          sx={{ p: 2, mb: 2, borderRadius: 2 }}
          elevation={5}
        >
          <Controller
            control={control}
            name={`stages.${index}.stageName`}
            render={({ field }) => (
              <>
                <InputLabel shrink htmlFor="bootstrap-input">
                  Name
                </InputLabel>
                <TextField
                  sx={{ paddingBlockEnd: 2 }}
                  error={!!errors.stages?.[index]?.stageName}
                  helperText={errors.stages?.[index]?.stageName?.message}
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
            name={`stages.${index}.stageDescription`}
            render={({ field }) => (
              <>
                <InputLabel shrink htmlFor="bootstrap-input">
                  Description
                </InputLabel>
                <TextField
                  error={!!errors.stages?.[index]?.stageDescription}
                  helperText={errors.stages?.[index]?.stageDescription?.message}
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
        {fields.length > 1 && (
          <Button
            size={ButtonSize.Small}
            variant={ButtonVariant.Danger}
            onClick={() => removeStage(fields.length - 1)}
            disabled={fields.length === 1}
          >
            Remove Stage
          </Button>
        )}
        <Button size={ButtonSize.Small} onClick={addStage}>
          Add Stage
        </Button>
      </Stack>
    </>
  )
}

export default Stages
