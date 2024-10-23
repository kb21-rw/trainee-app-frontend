import { ButtonSize } from '../../utils/types'
import Button from '../../components/ui/Button'

const ActionButtons = () => {
  return (
    <div className='flex items-center justify-center text-xs space-x-2 w-full h-full'>
      <Button size={ButtonSize.Small} outlined>
        View
      </Button>
      <Button size={ButtonSize.Small} outlined>
        Edit
      </Button>
    </div>
  )
}

export default ActionButtons
