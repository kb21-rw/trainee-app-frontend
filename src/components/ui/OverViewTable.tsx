import React from "react";
import {
  DataGrid,
  GridCellEditStopReasons,
  GridColDef,
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
} from "../../utils/types";
import Button from "./Button";

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
  // eslint-disable-next-line no-unused-vars
  action: (_row: DecisionInfo) => void;
}

const OverViewTable: React.FC<DataGridProps> = ({
  forms,
  participants,
  coaches,
  stages,
  action,
}) => {
  const questionColumns = forms.flatMap((form) =>
    form.questions.map((question) => ({
      field: question._id,
      headerName: question.prompt,
      width: 250,
      valueGetter: (value: never) => value ?? "No response",
    })),
  );

  const formattedColumns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 200 },
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
      renderCell: (params) => {
        const coach = coaches.find((coach) => coach._id === params.value);
        return coach ? coach.name : "No coach";
      },
    },
    { field: "stage", headerName: "Stage", width: 200 },
    ...questionColumns,
    {
      field: "actions",
      headerName: "Actions",
      width: 300,

      renderCell: ({ row: { id, email, name, stage } }) => (
        <div className="flex justify-around content-center align-middle py-2 h-full">
          <Button
            variant={ButtonVariant.Danger}
            size={ButtonSize.Small}
            onClick={() =>
              action({
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
              action({
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
      ),
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

    return {
      id: user.user._id,
      name: user.user.name,
      email: user.user.email,
      coach: user.user.coach?._id ?? "",
      stage: stage.name,
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

  return (
    <DataGrid
      rows={rows}
      columns={formattedColumns}
      columnGroupingModel={columnGroupingModel}
      hideFooter={true}
      disableRowSelectionOnClick
      onCellEditStop={(params, event) => {
        if (params.reason === GridCellEditStopReasons.cellFocusOut) {
          event.defaultMuiPrevented = true;
        }
      }}
      processRowUpdate={(updatedRow) => {
        console.log(updatedRow);
        return updatedRow;
      }}
      onProcessRowUpdateError={(error) => console.log(error)}
      sx={{
        "& .MuiDataGrid-cell": {
          border: "1px solid #000",
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
      }}
    />
  );
};

export default OverViewTable;
