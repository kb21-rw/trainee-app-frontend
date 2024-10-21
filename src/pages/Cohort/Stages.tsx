import { Paper, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import CohortTextField from './CohortTextField'
import Button from '../../components/ui/Button'
import { ButtonSize, ButtonVariant } from '../../utils/types'

function Stages() {
  const [stages, setStages] = useState<{ name: string; description: string }[]>(
    [{ name: '', description: '' }]
  )

  const addStage = () => {
    setStages([...stages, { name: '', description: '' }])
  }

  const removeStage = () => {
    if (stages.length > 1) {
      setStages(stages.slice(0, -1))
    }
  }

  const handleStageChange = (index: number, field: string, value: string) => {
    const newStages = [...stages]
    newStages[index][field as keyof (typeof newStages)[number]] = value
    setStages(newStages)
  }

  return (
    <>
      <Typography marginBlock={2}>Stages</Typography>
      {stages.map((stage, index) => (
        <Paper key={index} sx={{ p: 2, mb: 2, borderRadius: 2 }} elevation={5}>
          <CohortTextField
            label='Name'
            placeholder={`Stage ${index + 1} Name`}
            value={stage.name}
            onChange={(e) => handleStageChange(index, 'name', e.target.value)}
          />
          <CohortTextField
            label='Description'
            value={stage.description}
            placeholder={`Stage ${index + 1} Description`}
            onChange={(e) =>
              handleStageChange(index, 'description', e.target.value)
            }
          />
        </Paper>
      ))}
      <Stack
        direction='row'
        display='flex'
        justifyContent='space-between'
        paddingBlockStart={1}
      >
        <Button
          size={ButtonSize.Small}
          variant={ButtonVariant.Danger}
          onClick={removeStage}
          disabled={stages.length === 1}
        >
          Remove Stage
        </Button>
        <Button size={ButtonSize.Small} onClick={addStage}>
          Add Stage
        </Button>
      </Stack>
    </>
  )
}

export default Stages
