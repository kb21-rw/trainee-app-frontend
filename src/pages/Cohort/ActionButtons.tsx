import React from 'react'
import { ButtonSize, ButtonVariant } from '../../utils/types'
import Button from '../../components/ui/Button'

type ActionProps = {
  size?: ButtonSize
  outlined?: boolean
  variant?: { leftbtn: ButtonVariant; rightbtn: ButtonVariant }
  buttonNames: { leftName: string; rightName: string }
}
const ActionButtons = ({
  size = ButtonSize.Small,
  outlined = true,
  variant,
  buttonNames,
}: ActionProps) => {
  return (
    <div className='flex items-center justify-center text-xs space-x-2 w-full h-full'>
      <Button size={size} outlined={outlined} variant={variant?.leftbtn}>
        {buttonNames.leftName}
      </Button>
      <Button size={size} outlined={outlined} variant={variant?.rightbtn}>
        {buttonNames.rightName}
      </Button>
    </div>
  )
}

export default ActionButtons
