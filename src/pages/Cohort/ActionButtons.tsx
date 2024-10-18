import React from 'react'
import { ButtonSize } from '../../utils/types'
import Button from '../../components/ui/Button'

const ActionButtons = () => {
  return (
    <div className='flex items-center justify-center space-x-2 w-full h-full'>
      <Button size={ButtonSize.Small} outlined className='text-xs'>
        View
      </Button>
      <Button size={ButtonSize.Small} outlined className='text-xs'>
        Edit
      </Button>
    </div>
  )
}

export default ActionButtons
