import { DataGrid } from '@mui/x-data-grid'
import React from 'react'
import ActionButtons from '../../Cohort/ActionButtons'
import { ButtonVariant } from '../../../utils/types'
// import { useGetApplicantsQuery } from "../../features/user/apiSlice";
// import { getApplicants, getJWT } from "../../utils/helper";
// import UserTableHeader from "../../components/ui/UserTableHeader";
// import {
//   applicantTableDataItems,
//   applicantTableHeaders,
//   applicantTableSortingValues,
//   applicantsPerPage,
// } from "../../utils/data";
// import UserTable from "../../components/ui/UserTable";
// import DropOrEnrollModal from "../../components/modals/DropOrEnrollModal";
// import { AiOutlineWarning } from "react-icons/ai";
// import { ApplicantDecision } from "../../utils/types";

// const Applicants = () => {
//   const jwt: string = getJWT();
//   const [query, setQuery] = useState("");
//   const [decideForUserId, setDecideForUserId] = useState<string | null>(
//     null,
//   );
//   const [isRejectUserModalOpen, setIsRejectUserModalOpen] =
//     useState<boolean>(false);
//   const [isAcceptUserModalOpen, setIsAcceptUserModalOpen] =
//     useState<boolean>(false);
//   const {
//     data,
//     isFetching: isGettingAllApplicantsLoading,
//     isError,
//   } = useGetApplicantsQuery({
//     jwt,
//     query,
//   });

//   const applicantsData = data?.map((item: any) => item.applicants);

//   const applicantList = getApplicants(
//     applicantsData?.[0],
//     applicantTableDataItems,
//   );

//   const userDecision = applicantList?.find(
//     (user) => user[0] == decideForUserId,
//   );

//   const userName = userDecision ? userDecision[2] : "";
//   const userEmail = userDecision ? userDecision[3] : "";

//   if (isError) {
//     return (
//       <div className="flex flex-col items-center justify-center p-6 bg-red-50 border border-red-200 rounded-lg text-center">
//         <AiOutlineWarning className="text-red-500 text-4xl mb-4" />
//         <p className="text-red-500 font-semibold text-lg">
//           Error fetching applicants
//         </p>
//         <p className="text-gray-600 mb-4">
//           Something went wrong while trying to load the data.
//         </p>
//         <button
//           onClick={() => window.location.reload()}
//           className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="py-12 space-y-5">
//       <UserTableHeader
//         setQuery={setQuery}
//         sortingValues={applicantTableSortingValues}
//         usersPerPageValues={applicantsPerPage}
//         userType="Applicant"
//       />
//       <UserTable
//         headers={applicantTableHeaders}
//         data={applicantList}
//         actions={[
//           {
//             type: "reject",
//             actionCaller: async (user: string) => {
//               await setDecideForUserId(user[0]);
//               setIsRejectUserModalOpen(true);
//             },
//           },
//           {
//             type: "accept",
//             actionCaller: async (user: string) => {
//               await setDecideForUserId(user[0]);
//               setIsAcceptUserModalOpen(true);
//             },
//           },
//         ]}
//         isLoading={isGettingAllApplicantsLoading}
//         hasResponse={true}
//       />
//       {isRejectUserModalOpen && (
//         <DropOrEnrollModal
//           closePopup={() => setIsRejectUserModalOpen(false)}
//           userName={userName}
//           userEmail={userEmail}
//           decideForUserId={decideForUserId}
//           decision={ApplicantDecision.Rejected}
//           jwt={jwt}
//         />
//       )}
//       {isAcceptUserModalOpen && (
//         <DropOrEnrollModal
//           closePopup={() => setIsAcceptUserModalOpen(false)}
//           userName={userName}
//           userEmail={userEmail}
//           decideForUserId={decideForUserId}
//           decision={ApplicantDecision.Accepted}
//           jwt={jwt}
//         />
//       )}
//     </div>
//   );
// };
// import { makeStyles } from '@mui/styles'

const columns = [
  { field: 'name', headerName: 'Name', width: 300 },
  { field: 'coach', headerName: 'Coach', width: 300 },
  { field: 'stage', headerName: 'Stage', width: 300 },
  {
    field: 'jsSubmission',
    headerName:
      'How has the trainee been submitting the challenges they have...',
    width: 300,
  },
  {
    field: 'jsEffort',
    headerName: 'On what topics does the trainee need to put effort into ?',
    width: 300,
  },
  {
    field: 'cssRate',
    headerName:
      'On the rate of 20, how can you rate this trainee in using CSS?',
    width: 250,
  },
  {
    field: 'cssFamiliarity',
    headerName:
      'How is the trainee familiar with flex, grid and positioning in CSS',
    width: 300,
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 350,
    renderCell: () => (
      <ActionButtons
        outlined={false}
        variant={{
          leftbtn: ButtonVariant.Danger,
          rightbtn: ButtonVariant.Primary,
        }}
        buttonNames={{ leftName: 'Reject', rightName: 'Accept' }}
      />
    ),
  },
]

const rows = [
  {
    id: 1,
    name: 'Bosco Karenzi',
    coach: 'David Gusenga',
    stage: 'Stage 1',
    jsSubmission: 'Good job',
    jsEffort: 'JavaScript fundamentals',
    cssRate: '15',
    cssFamiliarity: 'Familiar with flex and grid',
  },
  {
    id: 2,
    name: 'Baptiste Irakoze',
    coach: 'Junior Migisha',
    stage: 'Stage 1',
    jsSubmission: 'No response',
    jsEffort: 'No response',
    cssRate: 'No response',
    cssFamiliarity: 'No response',
  },
]

const columnGroupingModel = [
  {
    groupId: 'javascriptGate',
    headerName: 'JavaScript Gate',
    children: [{ field: 'jsSubmission' }, { field: 'jsEffort' }],
  },
  {
    groupId: 'cssGate',
    headerName: 'CSS Gate',
    children: [{ field: 'cssRate' }, { field: 'cssFamiliarity' }],
  },
]
const Applicants = () => {
  return (
    <div className='mt-32'>
      <DataGrid
        rows={rows}
        columns={columns}
        columnGroupingModel={columnGroupingModel}
        sx={{
          border: 'none',
          '& .MuiDataGrid-cell': {
            borderInlineEnd: '1px solid black',
            borderBlockEnd: '1px solid black',
          },
          '& .MuiDataGrid-columnHeaders': {
            borderBlockEnd: '1px solid black',
          },
          '& .MuiDataGrid-columnHeader': {
            borderInlineEnd: '1px solid black',
            borderBlockEnd: '1px solid black',
          },
          '& .MuiDataGrid-columnHeader--filledGroup': {
            borderBlockStart: '1px solid black',
          },
          '& .MuiDataGrid-columnHeader--emptyGroup': {
            '.MuiDataGrid-columnHeader--last': {},
            borderBlockEnd: '1px solid black',
          },
        }}
        hideFooter={true}
      />
    </div>
  )
}

export default Applicants
