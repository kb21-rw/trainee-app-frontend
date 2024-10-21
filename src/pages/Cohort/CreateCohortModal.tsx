import { Box, Modal, Typography } from '@mui/material'
import React, { useState } from 'react'
import Button from '../../components/ui/Button'
import { ButtonSize } from '../../utils/types'
import CreateCohortForm from './CreateCohortForm'

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
}
function CreateCohortModal() {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <Button onClick={handleOpen} size={ButtonSize.Small}>
        Create cohort
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
        sx={{ paddingInline: 10 }}
      >
        <Box sx={{ ...style, maxHeight: '80vh', overflow: 'auto' }}>
          <Typography
            id='modal-modal-title'
            variant='h5'
            component='h2'
            sx={{ textAlign: 'center', fontWeight: 'bold' }}
          >
            Create a new Cohort
          </Typography>
          <CreateCohortForm />
        </Box>
      </Modal>
    </>
  )
}

export default CreateCohortModal
