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
