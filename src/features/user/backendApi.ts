import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { apiUrl } from "../../utils/constants"
import { makeAuthRequest } from "../../utils/requestHelper"

export const backendApi: any = createApi({
  reducerPath: "backendApi",
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }),
  tagTypes: [
    "coaches",
    "trainees",
    "myTrainees",
    "profile",
    "forms",
    "questions",
    "response",
    "overview",
    "applicantForm",
    "applicantResponse",
    "cohorts",
    "token",
    "users",
  ],
  endpoints: (builder) => ({
    getTraineesForCoach: builder.query({
      query: (args) => {
        const { cohortId, coachId } = args
        return makeAuthRequest({
          url: `/cohorts/overview?type=Trainee${cohortId ? "&cohortId=" + cohortId : ""}${coachId ? "&coachId=" + coachId : ""}`,
          method: "GET",
        })
      },
      providesTags: ["myTrainees"],
    }),

    getUsers: builder.query({
      query: (args) => {
        const { search } = args ?? {}
        return makeAuthRequest({
          url: `/users?${search ? search : ""}`,
          method: "GET",
        })
      },
      providesTags: ["users"],
    }),

    getCoaches: builder.query({
      query: (args) => {
        const { cohortId } = args ?? {}
        return makeAuthRequest({
          url: `/coaches${cohortId ? "?cohortId=" + cohortId : ""}`,
          method: "GET",
        })
      },
      providesTags: ["coaches"],
    }),

    addCoach: builder.mutation({
      query: (args) => {
        const { coachId } = args ?? {}
        return makeAuthRequest({
          url: "/coaches",
          method: "POST",
          body: { coachId },
        })
      },
      invalidatesTags: ["coaches"],
    }),

    createUser: builder.mutation({
      query: (args) => {
        const { body } = args
        return makeAuthRequest({
          url: "/auth/register",
          method: "POST",
          body,
        })
      },
      invalidatesTags: ["users"],
    }),
    createCoach: builder.mutation({
      query: (args) => {
        const { body } = args
        return makeAuthRequest({
          url: `/coaches/new`,
          method: "POST",
          body,
        })
      },
      invalidatesTags: ["coaches"],
    }),

    updateUser: builder.mutation({
      query: (args) => {
        const { body, id } = args
        return makeAuthRequest({
          url: `/users/${id}`,
          method: "PATCH",
          body,
        })
      },
      invalidatesTags: ["users"],
    }),

    toggleUserActiveStatus: builder.mutation({
      query: (args) => {
        const { userId } = args
        return makeAuthRequest({
          url: `/users/${userId}/status`,
          method: "PATCH",
        })
      },
      invalidatesTags: ["users", "overview"],
    }),

    editCoach: builder.mutation({
      query: (args) => {
        const { body, id } = args
        return makeAuthRequest({
          url: `/coaches/edit-coach-or-admin/${id}`,
          method: "PATCH",
          body: { ...body },
        })
      },
      invalidatesTags: ["coaches", "overview"],
    }),

    editTrainee: builder.mutation({
      query: (args) => {
        const { body, id } = args
        return makeAuthRequest({
          url: `/trainees/${id}`,
          method: "PATCH",
          body: { ...body },
        })
      },
      invalidatesTags: ["trainees", "myTrainees"],
    }),

    updateParticipant: builder.mutation({
      query: (args) => {
        const { body, participantId } = args
        return makeAuthRequest({
          url: `/trainees/${participantId}`,
          method: "PATCH",
          body: { ...body },
        })
      },
      invalidatesTags: ["overview"],
    }),

    deleteCoach: builder.mutation({
      query: (args) => {
        const { id } = args
        return makeAuthRequest({
          url: `/users/${id}`,
          method: "DELETE",
        })
      },
      invalidatesTags: ["coaches", "overview"],
    }),

    deleteTrainee: builder.mutation({
      query: (args) => {
        const { id } = args
        return makeAuthRequest({
          url: `/users/${id}`,
          method: "DELETE",
        })
      },
      invalidatesTags: ["trainees"],
    }),

    login: builder.mutation({
      query: (body) => {
        return {
          url: "/auth/login",
          method: "POST",
          body,
        }
      },
      invalidatesTags: ["token"],
    }),

    googleAuth: builder.mutation({
      query: (body) => {
        return {
          url: "/auth/google",
          method: "POST",
          body,
        }
      },
      invalidatesTags: ["token"],
    }),

    signup: builder.mutation({
      query: (body) => {
        return {
          url: "auth/register/applicant",
          method: "POST",
          body: { ...body },
        }
      },
    }),
    verifyApplicant: builder.mutation({
      query: (userId) => {
        return {
          url: `/auth/applicant/verify?userId=${userId}`,
          method: "PATCH",
        }
      },
    }),

    resetPassword: builder.mutation({
      query: (body) => {
        return {
          url: "/auth/reset-password",
          method: "POST",
          body,
        }
      },
    }),

    getProfile: builder.query({
      query: () => {
        return makeAuthRequest({
          url: "/users/my-profile",
          method: "GET",
        })
      },
      providesTags: ["profile"],
    }),

    updateProfile: builder.mutation({
      query: (args) => {
        const { profileData } = args
        return makeAuthRequest({
          url: "/users/my-profile",
          method: "PATCH",
          body: { ...profileData },
        })
      },
      invalidatesTags: ["profile"],
    }),

    getAllForms: builder.query({
      query: (args) => {
        const { searchString = "", cohort } = args
        let queryString = `searchString=${searchString}`
        if (cohort) {
          queryString += `&cohort=${cohort}`
        }

        return makeAuthRequest({
          url: `/forms?${queryString}`,
          method: "GET",
        })
      },
      providesTags: ["forms"],
    }),

    getForm: builder.query({
      query: (args) => {
        const { id } = args
        return makeAuthRequest({
          url: `/forms/${id}`,
          method: "GET",
        })
      },
      providesTags: ["forms"],
    }),

    createForm: builder.mutation({
      query: (args) => {
        const { body } = args
        return makeAuthRequest({
          url: "/forms",
          method: "POST",
          body: { ...body },
        })
      },
      invalidatesTags: ["forms", "overview"],
    }),

    editForm: builder.mutation({
      query: (args) => {
        const { body, id } = args
        return makeAuthRequest({
          url: `/forms/${id}`,
          method: "PATCH",
          body: { ...body },
        })
      },
      invalidatesTags: ["forms"],
    }),

    deleteForm: builder.mutation({
      query: (args) => {
        const { id } = args
        return makeAuthRequest({
          url: `/forms/${id}`,
          method: "DELETE",
        })
      },
      invalidatesTags: ["forms"],
    }),

    getAllQuestionsForForm: builder.query({
      query: (args) => {
        const { formId } = args
        return makeAuthRequest({
          url: `/questions/${formId}`,
          method: "GET",
        })
      },
      providesTags: ["questions"],
    }),

    createQuestion: builder.mutation({
      query: (args) => {
        const { formId, body } = args
        return makeAuthRequest({
          url: `/questions/${formId}`,
          method: "POST",
          body: { ...body },
        })
      },
      invalidatesTags: ["forms", "overview"],
    }),

    deleteQuestion: builder.mutation({
      query: (args) => {
        const { id } = args
        return makeAuthRequest({
          url: `/questions/${id}`,
          method: "DELETE",
        })
      },
      invalidatesTags: ["forms", "overview"],
    }),

    editQuestion: builder.mutation({
      query: (args) => {
        const { body, id } = args
        return makeAuthRequest({
          url: `/questions/${id}`,
          method: "PATCH",
          body: { ...body },
        })
      },
      invalidatesTags: ["forms", "overview"],
    }),
    getOverview: builder.query({
      query: () =>
        makeAuthRequest({
          url: "/overview",
          method: "GET",
        }),
      providesTags: ["overview"],
    }),

    getOverviewForCoach: builder.query({
      query: () =>
        makeAuthRequest({
          url: "/overview/my-trainees",
          method: "GET",
        }),
      providesTags: ["overview"],
    }),

    addResponse: builder.mutation({
      query: ({ body }) =>
        makeAuthRequest({
          url: `/responses`,
          method: "PUT",
          body,
        }),
      invalidatesTags: ["overview", "response"],
    }),

    getMyApplication: builder.query({
      query: () => {
        return makeAuthRequest({
          url: `/cohorts/my-application`,
          method: "GET",
        })
      },
      providesTags: ["applicantForm"],
    }),

    getApplicationForm: builder.query({
      query: () => {
        return makeAuthRequest({
          url: `/cohorts/application`,
          method: "GET",
        })
      },
      keepUnusedDataFor: 0,
      providesTags: ["applicantForm"],
    }),

    addApplicantResponse: builder.mutation({
      query: ({ body, action }) =>
        makeAuthRequest({
          url: `/responses/apply?action=${action}`,
          method: "POST",
          body,
        }),
      invalidatesTags: ["applicantResponse"],
    }),

    createCohort: builder.mutation({
      query: (args) => {
        const { body } = args
        return makeAuthRequest({
          url: "/cohorts",
          method: "POST",
          body,
        })
      },
      invalidatesTags: ["cohorts"],
    }),

    updateCohort: builder.mutation({
      query: (args) => {
        const { body, id } = args
        return makeAuthRequest({
          url: `/cohorts/${id}`,
          method: "PATCH",
          body,
        })
      },
      invalidatesTags: ["cohorts"],
    }),
    getApplicants: builder.query({
      query: (args) => {
        const { cohortId } = args
        return makeAuthRequest({
          url: `/cohorts/overview${cohortId ? "?cohortId=" + cohortId : ""}`,
          method: "GET",
        })
      },
      providesTags: ["overview"],
    }),
    getTrainees: builder.query({
      query: (args) => {
        const { cohortId } = args
        return makeAuthRequest({
          url: `/cohorts/overview?type=Trainee${cohortId ? "&cohortId=" + cohortId : ""}`,
          method: "GET",
        })
      },
      providesTags: ["overview"],
    }),
    applicantDecision: builder.mutation({
      query: (args) => {
        const { body } = args
        return makeAuthRequest({
          url: `/trainees/decision`,
          method: "PATCH",
          body: { ...body },
        })
      },
      invalidatesTags: ["overview"],
    }),
    addApplicants: builder.mutation({
      query: ({ body }) => {
        return makeAuthRequest({
          url: `/cohorts/add-applicants`,
          method: "PATCH",
          body,
        })
      },
      invalidatesTags: ["overview", "users"],
    }),
    getAllCohorts: builder.query({
      query: (args) => {
        const { query } = args ?? {}
        return makeAuthRequest({
          url: `/cohorts?${query}`,
          method: "GET",
        })
      },
      providesTags: ["cohorts"],
    }),
  }),
})

export const {
  useGetCoachesQuery,
  useGetUsersQuery,
  useAddCoachMutation,
  useCreateUserMutation,
  useCreateCoachMutation,
  useUpdateUserMutation,
  useLoginMutation,
  useSignupMutation,
  useVerifyApplicantMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useToggleUserActiveStatusMutation,
  useResetPasswordMutation,
  useDeleteCoachMutation,
  useDeleteTraineeMutation,
  useGetTraineesForCoachQuery,
  useEditCoachMutation,
  useEditTraineeMutation,
  useUpdateParticipantMutation,
  useGetAllFormsQuery,
  useDeleteFormMutation,
  useGetFormQuery,
  useCreateFormMutation,
  useEditFormMutation,
  useEditQuestionMutation,
  useGetAllQuestionsForFormQuery,
  useCreateQuestionMutation,
  useDeleteQuestionMutation,
  useGetOverviewQuery,
  useAddResponseMutation,
  useGetOverviewForCoachQuery,
  useGetMyApplicationQuery,
  useAddApplicantResponseMutation,
  useCreateCohortMutation,
  useUpdateCohortMutation,
  useGetApplicantsQuery,
  useGetTraineesQuery,
  useApplicantDecisionMutation,
  useAddApplicantsMutation,
  useGetAllCohortsQuery,
  useGetApplicationFormQuery,
  useGoogleAuthMutation,
} = backendApi
