export const customizeDataGridStyles = {
  border: "none",
  "& .MuiDataGrid-row": {
    borderBottom: "1px solid #000000",
  },
  "& .MuiDataGrid-columnHeader": {
    backgroundColor: "#CCE4F0",
    fontWeight: "bold",
    fontSize: "18px",
    border: "none",
  },
  "& .MuiDataGrid-columnSeparator": {
    display: "none",
  },
  "& .MuiDataGrid-cell:focus": {
    outline: "none",
  },
  "& .MuiDataGrid-columnHeaderDraggableContainer": {
    visibility: "visible !important",
  },
  "& .MuiDataGrid-columnHeaderTitleContainer": {
    visibility: "visible !important",
  },
  "& .MuiDataGrid-iconButtonContainer": {
    visibility: "visible",
  },
  "& .MuiDataGrid-sortIcon": {
    opacity: "inherit !important",
  },
  "& .MuiDataGrid-menuIcon": {
    visibility: "visible !important",
    width: "auto",
  },
}

export const overViewDataGridStyles = {
  border: "none",
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
  "& .MuiDataGrid-iconButtonContainer": {
    visibility: "visible",
  },
  "& .MuiDataGrid-sortIcon": {
    opacity: "inherit !important",
  },
  "& .MuiDataGrid-menuIcon": {
    visibility: "visible !important",
    width: "auto",
  },
}
