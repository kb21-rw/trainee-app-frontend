import { Grid2, InputLabel, TextField, TextFieldProps } from '@mui/material'
import React from 'react'
import { Controller, UseFormRegister } from 'react-hook-form'

type InputMuiProps = {
  label: string
  name: string
  control: any
  register: UseFormRegister<any>
  errors: any
  variant?: TextFieldProps['variant']
} & Omit<TextFieldProps, 'variant'>

function CohortTextField({
  label,
  name,
  control,
  register,
  errors,
  ...props
}: InputMuiProps) {
  return (
    <Grid2 paddingBlockEnd={2}>
      <Controller
        control={control}
        name={name}
        render={({ field: { value } }) => {
          return (
            <>
              <InputLabel shrink htmlFor='bootstrap-input'>
                {label}
              </InputLabel>
              <TextField
                error={name in errors}
                value={value}
                helperText={errors[name]?.message}
                {...register(name)}
                size='small'
                fullWidth
                {...props}
              />
            </>
          )
        }}
      />
    </Grid2>
  )
}

export default CohortTextField
