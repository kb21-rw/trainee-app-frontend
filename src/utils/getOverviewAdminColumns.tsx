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
        ...coaches
          .filter((coach) => coach.active)
          .map((coach) => ({
            value: coach._id,
            label: coach.name,
          })),
      ],
    },
  ]
}
