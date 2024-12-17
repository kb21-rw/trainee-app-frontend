import { useState } from "react";
import {
  DataGrid,
  GridCellEditStopReasons,
  GridColDef,
  GridEventListener,
  GridRowsProp,
} from "@mui/x-data-grid";
import {
  Form as BaseForm,
  Response as BaseResponse,
  Question as BaseQuestion,
  CohortParticipant,
  Stage,
  User,
  ButtonSize,
  ButtonVariant,
  DecisionInfo,
  Decision,
  ResponseModalQuestion,
  ResponseCell,
  ParticipantPhase,
} from "../../utils/types";
import Button from "./Button";
import { GridStateColDef } from "@mui/x-data-grid/internals";
import WriteIcon from "../../assets/WriteIcon";
import SettingsIcon from "../../assets/SettingsIcon";
import SettingsModal from "../modals/Settings";

interface Response extends BaseResponse {
  questionId: string;
}

type Question = (Omit<BaseQuestion, "responses"> & { responses: Response })[];
type Form = Omit<BaseForm, "questions"> & { questions: Question };

interface DataGridProps {
  forms: Form[];
  participants: CohortParticipant[];
  stages: Stage[];
  coaches: User[];
  updates: ResponseCell[] | null;
  actions: {
    // eslint-disable-next-line no-unused-vars
    handleDecision?: (_row: DecisionInfo) => void;
    // eslint-disable-next-line no-unused-vars
    handleUpsertResponse?: (_row: any) => void;
    handleCoachChange?: ({
      // eslint-disable-next-line no-unused-vars
      coach,
      // eslint-disable-next-line no-unused-vars
      participantId,
    }: {
      coach: string;
      participantId: null | string;
    }) => void;
  };
}

export default function OverViewTable({
  forms,
  participants,
  coaches,
  stages,
  actions: {
    handleDecision = () => undefined,
    handleUpsertResponse = () => undefined,
    handleCoachChange = () => undefined,
  },
}: DataGridProps) {
  const [settingsInfo, setSettingsInfo] = useState<any>(null);

  const questionColumns: GridColDef[] = forms.flatMap((form) =>
    form.questions.map(({ _id, prompt, options, required, type }) => ({
      field: _id,
      headerName: prompt,
      width: 250,
      question: { _id, prompt, options, required, type, form: form.name },
      valueFormatter: (value) => value ?? "No response",
    })),
  );

  const formattedColumns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      width: 200,
      renderCell: ({ row }) => (
        <div className="flex items-center justify-between">
          <span>{row.name}</span>
          <div className="flex items-center gap-2">
            <button className="hover:scale-125 duration-200">
              <WriteIcon className="h-4 w-4 fill-primary-dark hover:fill-primary-light" />
            </button>
            <button
              className="hover:scale-125 duration-200"
              onClick={() => setSettingsInfo(row)}
            >
              <SettingsIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      ),
    },
    {
      field: "coach",
      headerName: "Coach",
      width: 200,
      editable: true,
      type: "singleSelect",
      valueOptions: [
        { value: "", label: "No coach" },
        ...coaches.map((coach) => ({ value: coach._id, label: coach.name })),
      ],
    },
    { field: "stage", headerName: "Stage", width: 200 },
    ...questionColumns,
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      align: "center",
      type: "singleSelect",
      valueOptions: [
        ParticipantPhase.Active,
        ParticipantPhase.Completed,
        ParticipantPhase.Rejected,
      ],
      renderCell: ({ row: { id, email, name, stage, actions } }) => {
        if (actions !== ParticipantPhase.Active) return actions;

        return (
          <div className="flex justify-around content-center align-middle py-2 h-full">
            <Button
              variant={ButtonVariant.Danger}
              size={ButtonSize.Small}
              onClick={() =>
                handleDecision({
                  userId: id,
                  decision: Decision.Rejected,
                  email,
                  name,
                  stage,
                })
              }
            >
              <span className="h-full flex justify-center items-center">
                Reject
              </span>
            </Button>
            <Button
              size={ButtonSize.Small}
              onClick={() =>
                handleDecision({
                  userId: id,
                  decision: Decision.Accepted,
                  email,
                  name,
                  stage,
                })
              }
            >
              <span className="h-full  flex justify-center items-center">
                Accept
              </span>
            </Button>
          </div>
        );
      },
    },
  ];

  const allResponses = forms.flatMap((form) =>
    form.questions.flatMap((question) => question.responses),
  );

  const users = allResponses.reduce(
    (
      uniqueUsers: { [key: string]: { user: User; responses: Response[] } },
      response,
    ) => {
      const userId = response.user._id;
      const existingUser = uniqueUsers[userId] ?? {};
      return {
        ...uniqueUsers,
        [userId]: {
          user: response.user,
          responses: {
            ...existingUser?.responses,
            [response?.questionId]: response.value,
          },
        },
      };
    },
    {},
  );

  const rows: GridRowsProp[] = Object.values(users).map((user) => {
    const userStage = participants.find(
      (userProgress) => userProgress.id === user.user._id,
    )!;
    const stage = stages.find(
      (stage) => stage.id === userStage.droppedStage.id,
    )!;

    const userPassed = userStage.passedStages.includes(
      stages[stages.length - 1].id,
    );

    const participantPhase = userStage.droppedStage.isConfirmed
      ? ParticipantPhase.Rejected
      : userPassed
      ? ParticipantPhase.Completed
      : ParticipantPhase.Active;

    return {
      id: user.user._id,
      name: user.user.name,
      email: user.user.email,
      coach: user.user.coach?._id ?? "",
      coachName: user.user.coach?.name ?? "No coach",
      stage: stage.name,
      actions: participantPhase,
      ...user.responses,
    };
  });

  const columnGroupingModel = forms.map((form) => ({
    groupId: form._id,
    headerName: form.name,
    children: form.questions.map((question) => ({
      field: question._id,
      headerName: question.prompt,
    })),
  }));

  const handleCellClick: GridEventListener<"cellClick"> = ({
    id,
    value: response,
    colDef,
    field,
    row: { actions },
  }) => {
    if (actions !== ParticipantPhase.Active) return;

    if (field.length !== 24) return; // not a question
    const customColDef = colDef as GridStateColDef & {
      question: ResponseModalQuestion;
    };
    handleUpsertResponse({
      userId: id,
      question: { ...customColDef.question, response },
    });
  };

  return (
    <>
      {setSettingsInfo && (
        <SettingsModal
          row={settingsInfo}
          onClose={() => setSettingsInfo(null)}
          handleDecision={handleDecision}
        />
      )}
      <DataGrid
        rows={rows}
        columns={formattedColumns}
        columnGroupingModel={columnGroupingModel}
        hideFooter={true}
        onCellClick={handleCellClick}
        disableRowSelectionOnClick
        onCellEditStop={(params, event) => {
          if (params.reason === GridCellEditStopReasons.cellFocusOut) {
            event.defaultMuiPrevented = true;
          }
        }}
        onCellEditStart={({ row: { actions } }, event) => {
          if (actions !== ParticipantPhase.Active) {
            event.defaultMuiPrevented = true;
          }
        }}
        processRowUpdate={(updatedRow) => {
          handleCoachChange({
            coach: updatedRow.coach ? updatedRow.coach : null,
            participantId: updatedRow.id,
          });
          return {
            ...updatedRow,
            coachName:
              coaches.find((coach) => coach._id === updatedRow.coach)?.name ??
              "No coach",
          };
        }}
        onProcessRowUpdateError={(error) => console.log(error)}
        getRowClassName={({ row: { actions } }) =>
          `${actions === ParticipantPhase.Rejected ? "rejected" : ""} ${
            actions === ParticipantPhase.Completed ? "completed" : ""
          } ${actions === ParticipantPhase.Active ? "active" : ""}`
        }
        sx={{
          "& .MuiDataGrid-cell": {
            border: "1px solid #000",
          },
          "& .MuiDataGrid-row.active": {
            cursor: "pointer",
          },
          "& .MuiDataGrid-columnHeader": {
            textAlign: "center",
            border: "1px solid #000",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold",
            fontSize: "15px",
            separator: "none",
          },
          "& .MuiDataGrid-columnHeaderTitleContainer": {
            justifyContent: "center",
          },
          "& .MuiDataGrid-columnHeaders": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-row.rejected": {
            bgcolor: "#FEE2E2",
          },
          "& .MuiDataGrid-row.rejected:hover": {
            bgcolor: "#FEE2E2",
          },
          "& .MuiDataGrid-row.completed": {
            bgcolor: "#86EFAC",
          },
          "& .MuiDataGrid-row.completed:hover": {
            bgcolor: "#86EFAC",
          },
        }}
      />
    </>
  );
}
