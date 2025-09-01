import { GridColDef } from "@mui/x-data-grid"
import Button from "../components/ui/Button"
import {
  ButtonSize,
  ButtonVariant,
  Decision,
  DecisionInfo,
  UserRow,
  ParticipantPhase,
  User,
} from "./types"
import { Box } from "@mui/material"
import { ArrowDropDown } from "@mui/icons-material"

export const getAdminActionColumns = (
  handleDecision: (_data: DecisionInfo) => void,
): GridColDef[] => [
  {
    field: "actions",
    flex: 1,
    headerName: "Actions",
    minWidth: 300,
    align: "center",
    type: "singleSelect",
    valueOptions: [
      ParticipantPhase.Active,
      ParticipantPhase.Completed,
      ParticipantPhase.Rejected,
    ],
    renderCell: ({ row }: { row: UserRow }) => {
      const { traineeId, email, name, stage, actions } = row
      if (actions !== ParticipantPhase.Active) return actions

      return (
        <div className="flex content-center justify-around h-full py-2 align-middle">
          <Button
            variant={ButtonVariant.Danger}
            size={ButtonSize.Small}
            onClick={() =>
              handleDecision({
                traineeId: traineeId as string,
                decision: Decision.Rejected,
                email,
                name,
                stage,
              })
            }
          >
            <span className="flex items-center justify-center h-full">
              Reject
            </span>
          </Button>
          <Button
            size={ButtonSize.Small}
            onClick={() =>
              handleDecision({
                traineeId: traineeId as string,
                decision: Decision.Accepted,
                email,
                name,
                stage,
              })
            }
          >
            <span className="flex items-center justify-center h-full">
              Accept
            </span>
          </Button>
        </div>
      )
    },
  },
]

export const getAdminCoachColumn = (coaches: User[]): GridColDef[] => {
  const activeCoaches = coaches.filter((coach) => coach.active)
  return [
    {
      field: "coach",
      flex: 1,
      headerName: "Coach",
      minWidth: 200,
      editable: true,
      type: "singleSelect",
      valueOptions: [
        { value: "", label: "No coach" },
        ...activeCoaches.map((coach) => ({
          value: coach._id,
          label: coach.name,
        })),
      ],
      renderCell: (params) => {
        const { value, row } = params
        const coach = activeCoaches.find((coach) => coach._id === value)
        const isPhaseCompleted =
          row.actions === ParticipantPhase.Completed ||
          row.actions === ParticipantPhase.Rejected
        const displayValue =
          isPhaseCompleted || coach ? row.coachName : "No coach"
        const isEditable = !isPhaseCompleted
        return (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
            sx={{
              cursor: isEditable ? "pointer" : "default",
              "&:hover": isEditable
                ? {
                    backgroundColor: "action.hover",
                    borderRadius: "4px",
                  }
                : {},
            }}
          >
            <span style={{ flex: 1 }}>{displayValue}</span>
            {isEditable && (
              <ArrowDropDown
                sx={{
                  color: "action.active",
                  fontSize: "20px",
                  ml: 1,
                  flexShrink: 0,
                }}
              />
            )}
          </Box>
        )
      },
    },
  ]
}
