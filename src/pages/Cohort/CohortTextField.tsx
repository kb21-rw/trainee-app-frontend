import { Grid2, InputLabel, TextField, TextFieldProps } from '@mui/material'
import React from 'react'

type InputMuiProps = {
  label: string
} & Omit<TextFieldProps, 'variant'>

function CohortTextField({ label, ...props }: InputMuiProps) {
  return (
    <Grid2 paddingBlockEnd={2}>
      <InputLabel shrink htmlFor='bootstrap-input'>
        {label}
      </InputLabel>
      <TextField size='small' required fullWidth {...props} />
    </Grid2>
  )
}

export default CohortTextField
