import { useState } from "react"
import {
  DataGrid,
  GridCellEditStopReasons,
  GridColDef,
  GridEventListener,
} from "@mui/x-data-grid"
import {
  Form as BaseForm,
  Response as BaseResponse,
  Question as BaseQuestion,
  CohortParticipant,
  Stage,
  User,
  DecisionInfo,
  ResponseModalQuestion,
  ResponseCell,
  ParticipantPhase,
  UserRow,
  ResponseModalInfo,
  UserRole,
  FormType,
} from "../../utils/types"
import { GridStateColDef } from "@mui/x-data-grid/internals"
import WriteIcon from "../../assets/WriteIcon"
import SettingsIcon from "../../assets/SettingsIcon"
import SettingsModal from "../modals/Settings"
import EditParticipantModal from "../modals/EditParticipantModal"
import { overViewDataGridStyles } from "../../utils/styles"
import {
  getAdminActionColumns,
  getAdminCoachColumn,
} from "../../utils/getOverviewAdminColumns"

interface Response extends BaseResponse {
  questionId: string
}

type Question = (Omit<BaseQuestion, "responses"> & { responses: Response[] })[]
type Form = Omit<BaseForm, "questions"> & { questions: Question }

interface DataGridProps {
  overviewType: "trainee" | "applicant"
  role: UserRole.Admin | UserRole.Coach
  forms: Form[]
  participants: CohortParticipant[]
  stages: Stage[]
  coaches: User[]
  participantsInfo: User[]
  updates: ResponseCell[] | null
  actions: {
    handleDecision?: (_data: DecisionInfo) => void
    handleUpsertResponse?: (_data: ResponseModalInfo) => void
    handleCoachChange?: (_params: {
      coachId: string
      participantId: null | string
    }) => void
  }
}

export default function OverViewTable({
  role,
  overviewType,
  forms,
  participants,
  participantsInfo,
  coaches,
  stages,
  actions: {
    handleDecision = () => undefined,
    handleUpsertResponse = () => undefined,
    handleCoachChange = () => undefined,
  },
}: DataGridProps) {
  const [settingsInfo, setSettingsInfo] = useState<any>(null)
  const [participantInfo, setParticipantInfo] = useState<any>(null)
  const isAdmin = role === UserRole.Admin

  const formsByOverviewType = forms.filter((form) =>
    overviewType === "trainee"
      ? form.type === FormType.Trainee
      : form.type === FormType.Application || form.type === FormType.Applicant,
  )
  const questionColumns: GridColDef[] = formsByOverviewType.flatMap((form) =>
    form.questions.map(({ _id, prompt, options, required, type }) => ({
      field: _id,
      headerName: prompt,
      flex: 1,
      minWidth: 200,
      question: { _id, prompt, options, required, type, form: form.name },
      valueFormatter: (value) => value ?? "No response",
    })),
  )

  const actionsColumns: GridColDef[] = isAdmin
    ? getAdminActionColumns(handleDecision)
    : []

  const coachColumn: GridColDef[] = isAdmin ? getAdminCoachColumn(coaches) : []
  const formattedColumns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 200,
      renderCell: ({ row }) => (
        <div className="flex items-center justify-between">
          <span>{row.name}</span>
          {role === UserRole.Admin && (
            <div className="flex items-center gap-2">
              {row.actions === ParticipantPhase.Active && (
                <button
                  className="duration-200 hover:scale-125"
                  onClick={() => setParticipantInfo(row)}
                >
                  <WriteIcon className="w-4 h-4 fill-primary-dark hover:fill-primary-light" />
                </button>
              )}

              <button
                className="duration-200 hover:scale-125"
                onClick={() => setSettingsInfo(row)}
              >
                <SettingsIcon className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      ),
    },
    ...coachColumn,
    { field: "stage", flex: 1, headerName: "Stage", minWidth: 200 },
    ...questionColumns,
    ...actionsColumns,
  ]

  const allResponses = formsByOverviewType.flatMap((form) =>
    form.questions.flatMap((question) => {
      const responses = question.responses
      return responses.map((response) => ({
        ...response,
        questionId: question._id,
      }))
    }),
  )

  // users with their responses
  let users = allResponses.reduce(
    (
      uniqueUsers: {
        [key: string]: {
          user: User
          responses: { [key: string]: string | string[] }
        }
      },
      response,
    ) => {
      if (!response.user || !response.user._id) {
        return uniqueUsers
      }

      const userId = response.user._id
      const existingUser = uniqueUsers[userId] ?? {
        user: response.user,
        responses: {},
      }
      return {
        ...uniqueUsers,
        [userId]: {
          user: response.user,
          responses: {
            ...existingUser.responses,
            [response.questionId]: response.value,
          },
        },
      }
    },
    {},
  )

  //Filter users according to whether they are in preselection or not
  const lastPreselectionStageIndex = stages.findLastIndex(
    (stage) => stage.isPreselection === "true",
  )

  const filteredParticipants = participants.filter((participant) => {
    const stageIndex = stages.findIndex(
      (stage) => stage._id === participant.stage,
    )
    return overviewType === "trainee"
      ? stageIndex > lastPreselectionStageIndex
      : true
  })

  // assign empty responses for users that don't have responses
  const missingUsers = filteredParticipants
    .filter((participant) => !users[participant.userId])
    .map((participant) => ({
      [participant.userId]: {
        user: participantsInfo.find(
          (participantInfo) => participantInfo._id === participant.userId,
        ),
        responses: {},
      },
    }))

  users = { ...users, ...Object.assign({}, ...missingUsers) }

  const rows: UserRow[] = Object.values(users).map((user) => {
    const userAsParticipant = participants.find(
      (participant) => participant.userId === user.user._id,
    )
    const userStage = stages.find(
      (stage) => stage._id === userAsParticipant?.stage,
    )

    const status = userAsParticipant?.traineeStatus
    const coach = coaches.find(
      (coach) => coach._id === userAsParticipant?.coachId,
    )

    const participantPhase =
      status === "REJECTED" || status === "DROPPED_OUT"
        ? ParticipantPhase.Rejected
        : status === "GRADUATED" ||
            (userStage?.isPreselection !== "true" && overviewType !== "trainee")
          ? ParticipantPhase.Completed
          : ParticipantPhase.Active

    const row = {
      id: user.user._id,
      traineeId: userAsParticipant?._id ?? `user-${user.user._id}`,
      name: user.user.name,
      email: user.user.email,
      coach: coach?._id ?? "",
      coachName: coach?.name ?? "No coach",
      stage: userStage?.name ?? "Unknown",
      actions: participantPhase,
      ...user.responses,
    }
    return row
  })

  const columnGroupingModel = formsByOverviewType.map((form) => ({
    groupId: form._id,
    headerName: form.name,
    children: form.questions.map((question) => ({
      field: question._id,
      headerName: question.prompt,
    })),
  }))

  const handleCellClick: GridEventListener<"cellClick"> = ({
    id,
    value: response,
    colDef,
    field,
    row: { actions },
  }) => {
    if (actions !== ParticipantPhase.Active) return

    if (field.length !== 24) return // not a question
    const customColDef = colDef as GridStateColDef & {
      question: ResponseModalQuestion
    }
    handleUpsertResponse({
      userId: id as string,
      question: {
        ...customColDef.question,
        response: response as string | string[] | null,
      },
    })
  }

  return (
    <>
      {setSettingsInfo && (
        <SettingsModal
          row={settingsInfo}
          onClose={() => setTimeout(() => setSettingsInfo(null), 0)}
          handleDecision={handleDecision}
          type={overviewType}
        />
      )}
      {participantInfo && (
        <EditParticipantModal
          type={overviewType}
          row={participantInfo}
          onClose={() => setTimeout(() => setParticipantInfo(null), 0)}
          coaches={coaches}
        />
      )}
      <DataGrid
        rows={rows}
        columns={
          formsByOverviewType.length === 0
            ? [
                { field: "name", headerName: "Name", flex: 1, minWidth: 200 },
                { field: "stage", headerName: "Stage", flex: 1, minWidth: 200 },
                ...coachColumn,
                ...actionsColumns,
              ]
            : formattedColumns
        }
        columnGroupingModel={columnGroupingModel}
        hideFooter={true}
        onCellClick={handleCellClick}
        disableRowSelectionOnClick
        autoPageSize
        slots={{
          noRowsOverlay: () => (
            <div className="flex items-center justify-center h-full">
              <p className="text-center">No {overviewType}s yet</p>
            </div>
          ),
        }}
        onCellEditStop={(params, event) => {
          if (params.reason === GridCellEditStopReasons.cellFocusOut) {
            event.defaultMuiPrevented = true
          }
        }}
        onCellEditStart={({ row: { actions } }, event) => {
          if (actions !== ParticipantPhase.Active) {
            event.defaultMuiPrevented = true
          }
        }}
        processRowUpdate={(updatedRow) => {
          handleCoachChange({
            coachId: updatedRow.coach ? updatedRow.coach : null,
            participantId: updatedRow.traineeId,
          })
          return {
            ...updatedRow,
            coachName:
              coaches.find((coach) => coach._id === updatedRow.coach)?.name ??
              "No coach",
          }
        }}
        onProcessRowUpdateError={(error) => console.log(error)}
        getRowClassName={({ row: { actions } }) =>
          `${actions === ParticipantPhase.Rejected ? "rejected" : ""} ${
            actions === ParticipantPhase.Completed ? "completed" : ""
          } ${actions === ParticipantPhase.Active ? "active" : ""}`
        }
        sx={overViewDataGridStyles}
      />
    </>
  )
}
