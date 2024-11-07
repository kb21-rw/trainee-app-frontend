import { GridColDef } from '@mui/x-data-grid'
import { TGroupData, TRowData } from './types'
import ActionButtons from '../../Cohort/ActionButtons'
import { ButtonVariant } from '../../../utils/types'
import React from 'react'

export const columns: GridColDef<TRowData>[] = [
  { field: 'name', headerName: 'Name', width: 300 },
  { field: 'coach', headerName: 'Coach', width: 300 },
  { field: 'stage', headerName: 'Stage', width: 300 },
  {
    field: 'jsSubmission',
    headerName: 'How has the trainee been submitting the challenges they have?',
    width: 300,
  },
  {
    field: 'jsEffort',
    headerName: 'On what topics does the trainee need to put effort into ?',
    width: 300,
  },
  {
    field: 'cssRate',
    headerName:
      'On the rate of 20, how can you rate this trainee in using CSS?',
    width: 250,
  },
  {
    field: 'cssFamiliarity',
    headerName:
      'How is the trainee familiar with flex, grid and positioning in CSS',
    width: 300,
  },
  {
    field: 'reactFamiliarity',
    headerName:
      'How is the trainee familiar with react, state and hooks in Reactjs',
    width: 300,
  },
  {
    field: 'htmlBasics',
    headerName:
      'How is the trainee familiar with react, state and hooks in HTML',
    width: 250,
  },
  {
    field: 'htmlAdvanced',
    headerName:
      'How is the trainee familiar with react, state and hooks in HTML Advanced',
    width: 300,
  },
  {
    field: 'somethingelse',
    headerName: 'Any other thing you would like to add',
    width: 300,
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 350,
    renderCell: () => (
      <ActionButtons
        outlined={false}
        variant={{
          leftbtn: ButtonVariant.Danger,
          rightbtn: ButtonVariant.Primary,
        }}
        buttonNames={{ leftName: 'Reject', rightName: 'Accept' }}
      />
    ),
  },
]
export const rows: TRowData[] = [
  {
    id: 1,
    name: 'Bosco Karenzi',
    coach: 'David Gusenga',
    stage: 'Stage 1',
    jsSubmission: 'Good job',
    jsEffort: 'JavaScript fundamentals',
    cssRate: '15',
    cssFamiliarity: 'Familiar with flex and grid',
    reactFamiliarity: 'No response',
    htmlBasics: 'Good',
    htmlAdvanced: 'No response',
    somethingelse: 'No response',
  },
  {
    id: 2,
    name: 'Baptiste Irakoze',
    coach: 'Junior Migisha',
    stage: 'Stage 1',
    jsSubmission: 'No response',
    jsEffort: 'No response',
    cssRate: 'No response',
    cssFamiliarity: 'No response',
    reactFamiliarity: 'No response',
    htmlBasics: 'Basic understanding',
    htmlAdvanced: 'No response',
    somethingelse: 'khiudshkjnkjandiuhadjhaihdui',
  },
]
export const dynamicGroupData: TGroupData[] = [
  {
    groupId: 'jsGroup',
    headerName: 'JavaScript Mastery',
    fields: ['jsSubmission', 'jsEffort'],
  },
  {
    groupId: 'cssGroup',
    headerName: 'CSS Expertise',
    fields: ['cssRate', 'cssFamiliarity', 'reactFamiliarity'],
  },
  {
    groupId: 'htmlGroup',
    headerName: 'HTML Proficiency',
    fields: ['htmlBasics', 'htmlAdvanced', 'somethingelse'],
  },
]
