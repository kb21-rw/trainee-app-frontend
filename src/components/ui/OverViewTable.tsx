import React from "react";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";

interface DataGridProps {
  cohortOverview: any;
  usersProgress: any;
}

const OverViewTable: React.FC<DataGridProps> = ({
  cohortOverview,
  usersProgress,
}) => {
  const formatCellValue = (value: any) => {
    if (!value) return "No response";
  };

  const questionColumns = cohortOverview.forms.flatMap((form: any) =>
    form.questions.map((question: any) => ({
      field: question._id,
      headerName: question.prompt,
      width: 250,
      renderCell: (params: any) => formatCellValue(params.value),
    })),
  );

  const formattedColumns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 200 },
    {
      field: "coach",
      headerName: "Coach",
      width: 200,
      valueGetter: (value) => value ?? "No coach",
    },
    { field: "stage", headerName: "Stage", width: 200 },
    ...questionColumns,
  ];

  const allResponses = cohortOverview.forms.flatMap((form: any) =>
    form.questions.flatMap((question: any) => question.responses),
  );

  const users = allResponses.reduce((uniqueUsers: any, response: any) => {
    const userId = response.user._id;
    const existingUser = uniqueUsers[userId] ?? {};
    return {
      ...uniqueUsers,
      [userId]: {
        user: response.user,
        responses: {
          ...existingUser?.responses,
          [response.questionId]: response.value,
        },
      },
    };
  }, {});

  const rows: GridRowsProp[] = Object.values(users).map((user: any) => {
    const userStage = usersProgress.find(
      (userProgress: any) => userProgress.id === user.user._id,
    );
    const stage = cohortOverview.stages.find(
      (stage: any) => stage.id === userStage.droppedStage.id,
    );

    return {
      id: user.user._id,
      name: user.user.name,
      coach: user.user.coach?.name,
      stage: stage.name,
      ...user.responses,
    };
  });

  const columnGroupingModel = cohortOverview.forms.map((form: any) => ({
    groupId: form._id,
    headerName: form.name,
    children: form.questions.map((question: any) => ({
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
      sx={{
        "& .MuiDataGrid-cell": {
          border: "1px solid #e0e0e0",
        },
        "& .MuiDataGrid-columnHeader": {
          textAlign: "center",
          border: "1px solid #e0e0e0",
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
