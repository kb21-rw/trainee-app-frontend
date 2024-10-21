import { Grid2, InputLabel, Stack } from '@mui/material'
import { Dayjs } from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import React from 'react'
import { DatePicker } from '@mui/x-date-pickers'
import Button from '../../components/ui/Button'
import { ButtonSize } from '../../utils/types'
import CohortTextField from './CohortTextField'
import Stages from './Stages'

function CreateCohortForm() {
  const [dateWithNoInitialValue, setDateWithNoInitialValue] =
    React.useState<Dayjs | null>(null)

  return (
    <Grid2 paddingBlock='23px' component='form'>
      <CohortTextField label='Names' />
      <CohortTextField label='Description' />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <InputLabel shrink htmlFor='bootstrap-input'>
          Training start date
        </InputLabel>
        <DatePicker
          slotProps={{
            textField: { size: 'small', required: true, fullWidth: true },
          }}
          value={dateWithNoInitialValue}
          onChange={(newValue: Dayjs | null) =>
            setDateWithNoInitialValue(newValue)
          }
        />
      </LocalizationProvider>

      <Stages />
      <Stack
        justifySelf='center'
        direction='row'
        justifyContent='center'
        marginBlockStart={4}
      >
        <Button size={ButtonSize.Small}>Submit</Button>
      </Stack>
    </Grid2>
  )
}

export default CreateCohortForm
