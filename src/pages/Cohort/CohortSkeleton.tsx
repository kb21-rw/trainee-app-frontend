import { Card, CardContent, CardHeader, Skeleton, Stack } from '@mui/material'

function CohortSkeleton() {
  return (
    <Card sx={{ blockSize: '100%' }} className='mt-10'>
      <CardHeader
        title={
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
          >
            <Skeleton variant='text' width='50%' />
            <Skeleton variant='text' width='10%' />
          </Stack>
        }
      />
      <CardContent>
        <Skeleton variant='rounded' height={600} />
        <Skeleton variant='text' width='100%' height={30} />
      </CardContent>
    </Card>
  )
}

export default CohortSkeleton
