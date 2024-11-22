import React from "react";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";

interface DataGridProps {
  data: any[];
}

const OverViewTable: React.FC<DataGridProps> = ({ data }) => {
  const formatCellValue = (value: any) => {
    if (!value) return "No response";
  };

  const questionColumns = data[0].forms.flatMap((form: any) =>
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

  const allResponses = data[0].forms.flatMap((form: any) =>
    form.questions.flatMap((question: any) => question.responses),
  );

  const users = allResponses.reduce((uniqueUsers: any, response: any) => {
    const userId = response.user._id;
    if (userId in uniqueUsers) {
      const existingUser = uniqueUsers[userId];

      return {
        ...uniqueUsers,
        [userId]: {
          ...existingUser,
          responses: {
            ...existingUser.responses,
            [response.questionId]: response.value,
          },
        },
      };
    }

    return {
      ...uniqueUsers,
      [response.user._id]: {
        user: response.user,
        responses: { [response.questionId]: response.value },
      },
    };
  }, {});

  const rows: GridRowsProp[] = Object.values(users).map((user: any) => {
    return {
      id: user.user._id,
      name: user.user.name,
      coach: user.user.coach?.name,
      ...user.responses,
    };
  });

  const columnGroupingModel = data.flatMap((cohort: any) =>
    cohort.forms.map((form: any) => ({
      groupId: form._id,
      headerName: form.name,
      children: form.questions.map((question: any) => ({
        field: question._id,
        headerName: question.prompt,
      })),
    })),
  );

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
