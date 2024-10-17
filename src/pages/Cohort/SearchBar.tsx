import React from 'react'
import { ButtonSize } from '../../utils/types'
import Button from '../../components/ui/Button'
import { Box, InputBase } from '@mui/material'

function SearchBar() {
  return (
    <Box
      component='form'
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: 400,
        border: '1px solid #b4bacb',
        borderRadius: '8px',
        paddingBlock: '2px',
        paddingInlineEnd: '2px',
      }}
    >
      <InputBase
        sx={{ ml: 2, flex: 1 }}
        placeholder='Enter name'
        inputProps={{ 'aria-label': 'Enter name' }}
      />
      <Button size={ButtonSize.Small} className='text-sm'>
        Search
      </Button>
    </Box>
  )
}

export default SearchBar
