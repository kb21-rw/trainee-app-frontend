import { InputLabel, Stack } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import React from 'react'
import { DatePicker } from '@mui/x-date-pickers'
import Button from '../../components/ui/Button'
import { ButtonSize } from '../../utils/types'
import CohortTextField from './CohortTextField'
import Stages from './Stages'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs, { Dayjs } from 'dayjs'

const schema = z.object({
  names: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  trainingStartDate: z
    .custom((value) => dayjs.isDayjs(value) || value instanceof Date, {
      message: 'Training start date is required',
    })
    .transform((value) => (dayjs.isDayjs(value) ? value.toDate() : value)),
  stages: z
    .array(
      z.object({
        stageName: z.string().min(2, 'Stage Name is required'),
        stageDescription: z.string().min(2, 'Stage Description is required'),
      })
    )
    .nonempty('At least one stage is required'),
})

const FORM_NAME = {
  names: 'names',
  description: 'description',
  trainingStartDate: 'trainingStartDate',
  stages: { stageName: 'stageName', stageDescription: 'stageDescription' },
} as const
function CreateCohortForm({ handleClose }: { handleClose: () => void }) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      names: '',
      description: '',
      trainingStartDate: null,
      stages: [{ stageName: '', stageDescription: '' }],
    },
  })

  const onSubmit = async (data: any) => {
    // Call your API endpoint with the form data
    handleClose()
    console.log(data, '------------------')
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(async (formData) => {
        try {
          await onSubmit(formData)
          reset()
        } catch (error) {
          reset(formData)
        }
      })}
    >
      <CohortTextField
        name={FORM_NAME.names}
        control={control}
        register={register}
        errors={errors}
        label='Names'
      />
      <CohortTextField
        name={FORM_NAME.description}
        control={control}
        register={register}
        errors={errors}
        label='Description'
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <InputLabel shrink htmlFor='bootstrap-input'>
          Training start date
        </InputLabel>
        <Controller
          control={control}
          name={FORM_NAME.trainingStartDate}
          render={({ field: { onChange, value } }) => {
            return (
              <DatePicker
                value={value || null}
                onChange={(newValue: Dayjs | null) => {
                  onChange(newValue)
                }}
                disablePast
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                    helperText: errors[FORM_NAME.trainingStartDate]?.message,
                    error: FORM_NAME.trainingStartDate in errors,
                  },
                }}
              />
            )
          }}
        />
      </LocalizationProvider>

      <Stages
        stagesNames={FORM_NAME.stages}
        control={control}
        register={register}
        errors={errors}
      />
      <Stack
        justifySelf='center'
        direction='row'
        justifyContent='center'
        marginBlockStart={4}
      >
        <Button type='submit' size={ButtonSize.Small}>
          Submit
        </Button>
      </Stack>
    </form>
  )
}

export default CreateCohortForm
