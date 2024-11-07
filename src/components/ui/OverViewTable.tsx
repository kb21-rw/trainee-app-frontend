import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface DataGridProps {
  data: any[];
}

const OverViewTable: React.FC<DataGridProps> = ({ data }) => {
  const formatCellValue = (value: any) =>
    Array.isArray(value) ? value.join(", ") : value;

  const uniqueQuestionsMap = new Map<
    string,
    { headerName: string; field: string }
  >();

  data.forEach((cohort: any) => {
    cohort.forms.forEach((form: any) => {
      form.questions.forEach((question: any, index: number) => {
        const columnKey = `form_${form._id}_question_${question._id}_${index}`;
        const uniqueKey = `${form._id}_${question.prompt}`;

        if (!uniqueQuestionsMap.has(uniqueKey)) {
          uniqueQuestionsMap.set(uniqueKey, {
            headerName: question.prompt,
            field: columnKey,
          });
        }
      });
    });
  });

  const uniqueColumns = Array.from(uniqueQuestionsMap.values());

  const formattedColumns: GridColDef[] = [
    { field: "applicantId", headerName: "Applicant ID", width: 200 },
    { field: "stage", headerName: "Stage", width: 200 },
    { field: "coach", headerName: "Coach", width: 200 },
    ...uniqueColumns.map((q) => ({
      field: q.field,
      headerName: q.headerName,
      width: 250,
      renderCell: (params: any) => formatCellValue(params.value),
    })),
  ];

  const rows = data.flatMap((cohort: any) =>
    cohort.applicants.map((applicant: any) => {
      const rowData: { [key: string]: any } = {
        id: applicant.id,
        applicantId: applicant.id,
        stage:
          applicant.passedStages.length > 0
            ? applicant.passedStages[0]
            : "Application",
        coach: cohort.coaches.length > 0 ? cohort.coaches[0] : "None",
      };

      cohort.forms.forEach((form: any) => {
        form.questions.forEach((question: any, qIndex: number) => {
          const response = question.responses.find(
            (r: any) => r.user._id === applicant.id,
          )?.value;
          rowData[`form_${form._id}_question_${question._id}_${qIndex}`] =
            response || "No Response yet";
        });
      });
      return rowData;
    }),
  );

  const columnGroupingModel = data.flatMap((cohort: any) =>
    cohort.forms.map((form: any) => ({
      groupId: form.name,
      headerName: form.name,
      children: form.questions.map((question: any, qIndex: number) => ({
        field: `form_${form._id}_question_${question._id}_${qIndex}`,
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
          textAlign: 'center',
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
