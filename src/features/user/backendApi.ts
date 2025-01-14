import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const api_url = import.meta.env.VITE_API_URL

export const backendApi: any = createApi({
  reducerPath: "backendApi",
  baseQuery: fetchBaseQuery({ baseUrl: api_url }),
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
    getAllTrainees: builder.query({
      query: (args) => {
        const { jwt, query } = args
        return {
          url: `/trainees/all${query}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      },
      providesTags: ["trainees"],
    }),

    getTraineesForCoach: builder.query({
      query: (args) => {
        const { jwt, query } = args
        return {
          url: `/trainees/my-trainees${query}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      },
      providesTags: ["myTrainees"],
    }),

    getUsers: builder.query({
      query: (args) => {
        const { jwt, search } = args
        return {
          url: `/users?${search ? search : ""}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      },
      providesTags: ["users"],
    }),

    getCoaches: builder.query({
      query: (args) => {
        const { jwt, cohortId } = args
        return {
          url: `/coaches${cohortId ? "?cohortId=" + cohortId : ""}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      },
      providesTags: ["coaches"],
    }),

    addCoach: builder.mutation({
      query: (args) => {
        const { jwt, coachId } = args
        return {
          url: "/coaches",
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: { coachId },
        }
      },
      invalidatesTags: ["coaches"],
    }),

    createUser: builder.mutation({
      query: (args) => {
        const { jwt, body } = args
        return {
          url: "/auth/register",
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body,
        }
      },
      invalidatesTags: ["users"],
    }),

    editCoach: builder.mutation({
      query: (args) => {
        const { jwt, body, id } = args
        return {
          url: `/coaches/edit-coach-or-admin/${id}`,
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: { ...body },
        }
      },
      invalidatesTags: ["coaches"],
    }),

    editTrainee: builder.mutation({
      query: (args) => {
        const { jwt, body, id } = args
        return {
          url: `/trainees/${id}`,
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: { ...body },
        }
      },
      invalidatesTags: ["trainees", "myTrainees"],
    }),

    updateParticipant: builder.mutation({
      query: (args) => {
        const { jwt, body, participantId } = args
        return {
          url: `/participants/${participantId}`,
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: { ...body, coach: body.coach === "" ? null : body.coach },
        }
      },
      invalidatesTags: ["overview"],
    }),

    deleteCoach: builder.mutation({
      query: (args) => {
        const { jwt, id } = args
        return {
          url: `/users/${id}`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      },
      invalidatesTags: ["coaches"],
    }),

    deleteTrainee: builder.mutation({
      query: (args) => {
        const { jwt, id } = args
        return {
          url: `/users/${id}`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      },
      invalidatesTags: ["trainees"],
    }),

    login: builder.mutation({
      query: (body) => {
        return {
          url: "/auth/login",
          method: "POST",
          body: { ...body },
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
      query: (jwt) => ({
        url: "/users/my-profile",
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
      providesTags: ["profile"],
    }),

    updateProfile: builder.mutation({
      query: (args) => {
        const { jwt, profileData } = args
        return {
          url: "/users/my-profile",
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: { ...profileData },
        }
      },
      invalidatesTags: ["profile"],
    }),

    getAllForms: builder.query({
      query: (args) => {
        const { jwt, searchString = "", cohort } = args
        let queryString = `searchString=${searchString}`
        if (cohort) {
          queryString += `&cohort=${cohort}`
        }

        return {
          url: `/forms?${queryString}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      },
      providesTags: ["forms"],
    }),

    getForm: builder.query({
      query: (args) => {
        const { jwt, id } = args
        return {
          url: `/forms/${id}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      },
      providesTags: ["forms"],
    }),

    createForm: builder.mutation({
      query: (args) => {
        const { jwt, body } = args
        return {
          url: "/forms",
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: { ...body },
        }
      },
      invalidatesTags: ["forms", "overview"],
    }),

    editForm: builder.mutation({
      query: (args) => {
        const { jwt, body, id } = args
        return {
          url: `/forms/${id}`,
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: { ...body },
        }
      },
      invalidatesTags: ["forms"],
    }),

    deleteForm: builder.mutation({
      query: (args) => {
        const { jwt, id } = args
        return {
          url: `/forms/${id}`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      },
      invalidatesTags: ["forms"],
    }),

    getAllQuestionsForForm: builder.query({
      query: (args) => {
        const { jwt, formId } = args
        return {
          url: `/questions/${formId}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      },
      providesTags: ["questions"],
    }),

    createQuestion: builder.mutation({
      query: (args) => {
        const { jwt, formId, body } = args
        return {
          url: `/questions/${formId}`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: { ...body },
        }
      },
      invalidatesTags: ["forms", "overview"],
    }),

    deleteQuestion: builder.mutation({
      query: (args) => {
        const { jwt, id } = args
        return {
          url: `/questions/${id}`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      },
      invalidatesTags: ["forms", "overview"],
    }),

    editQuestion: builder.mutation({
      query: (args) => {
        const { jwt, body, id } = args
        return {
          url: `/questions/${id}`,
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: { ...body },
        }
      },
      invalidatesTags: ["forms", "overview"],
    }),
    getOverview: builder.query({
      query: ({ jwt }) => ({
        url: "/overview",
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
      providesTags: ["overview"],
    }),

    getOverviewForCoach: builder.query({
      query: ({ jwt }) => ({
        url: "/overview/my-trainees",
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
      providesTags: ["overview"],
    }),

    addResponse: builder.mutation({
      query: ({ jwt, body }) => ({
        url: `/responses`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body,
      }),
      invalidatesTags: ["overview", "response"],
    }),

    getMyApplication: builder.query({
      query: (jwt) => {
        return {
          url: `/cohorts/my-application`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      },
      providesTags: ["applicantForm"],
    }),

    getApplicationForm: builder.query({
      query: (jwt) => {
        return {
          url: `/cohorts/application`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      },
      providesTags: ["applicantForm"],
    }),

    addApplicantResponse: builder.mutation({
      query: ({ jwt, body, action }) => ({
        url: `/responses/apply?action=${action}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body,
      }),
      invalidatesTags: ["applicantResponse"],
    }),

    createCohort: builder.mutation({
      query: (args) => {
        const { jwt, body } = args
        return {
          url: "/cohorts",
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: { ...body },
        }
      },
      invalidatesTags: ["cohorts"],
    }),
    getApplicants: builder.query({
      query: (args) => {
        const { jwt, cohortId } = args
        return {
          url: `/cohorts/overview${cohortId ? "?cohortId=" + cohortId : ""}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      },
      providesTags: ["overview"],
    }),
    applicantDecision: builder.mutation({
      query: (args) => {
        const { jwt, body } = args
        return {
          url: `/cohorts/decision`,
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: { ...body },
        }
      },
      invalidatesTags: ["overview"],
    }),
    addApplicants: builder.mutation({
      query: ({ jwt, body }) => {
        return {
          url: `/cohorts/add-applicants`,
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body,
        }
      },
      invalidatesTags: ["overview", "users"],
    }),
    getAllCohorts: builder.query({
      query: (args) => {
        const { jwt, query } = args
        return {
          url: `/cohorts?${query}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      },
      providesTags: ["cohorts"],
    }),
  }),
})

export const {
  useGetAllTraineesQuery,
  useGetCoachesQuery,
  useGetUsersQuery,
  useAddCoachMutation,
  useCreateUserMutation,
  useLoginMutation,
  useSignupMutation,
  useVerifyApplicantMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
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
  useGetApplicantsQuery,
  useApplicantDecisionMutation,
  useAddApplicantsMutation,
  useGetAllCohortsQuery,
  useGetApplicationFormQuery,
} = backendApi
