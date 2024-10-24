import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const api_url = import.meta.env.VITE_API_URL;

export const usersApi: any = createApi({
  reducerPath: "usersApi",
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
    "applicants"
  ],
  endpoints: (builder) => ({
    getAllTrainees: builder.query({
      query: (args) => {
        const { jwt, query } = args;
        return {
          url: `/trainees/all${query}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        };
      },
      providesTags: ["trainees"],
    }),

    getTraineesForCoach: builder.query({
      query: (args) => {
        const { jwt, query } = args;
        return {
          url: `/trainees/my-trainees${query}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        };
      },
      providesTags: ["myTrainees"],
    }),

    getAllCoaches: builder.query({
      query: (args) => {
        const { jwt, query } = args;
        return {
          url: `/coaches/all${query}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        };
      },
      providesTags: ["coaches"],
    }),

    createCoach: builder.mutation({
      query: (args) => {
        const { jwt, body } = args;
        return {
          url: "/auth/register",
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: { ...body },
        };
      },
      invalidatesTags: ["coaches"],
    }),

    createTrainee: builder.mutation({
      query: (args) => {
        const { jwt, body } = args;
        return {
          url: "/auth/register",
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: { ...body },
        };
      },
      invalidatesTags: ["trainees"],
    }),

    editCoach: builder.mutation({
      query: (args) => {
        const { jwt, body, id } = args;
        return {
          url: `/coaches/edit-coach-or-admin/${id}`,
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: { ...body },
        };
      },
      invalidatesTags: ["coaches"],
    }),

    editTrainee: builder.mutation({
      query: (args) => {
        const { jwt, body, id } = args;
        return {
          url: `/trainees/${id}`,
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: { ...body },
        };
      },
      invalidatesTags: ["trainees", "myTrainees"],
    }),

    deleteCoach: builder.mutation({
      query: (args) => {
        const { jwt, id } = args;
        return {
          url: `/users/${id}`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        };
      },
      invalidatesTags: ["coaches"],
    }),

    deleteTrainee: builder.mutation({
      query: (args) => {
        const { jwt, id } = args;
        return {
          url: `/users/${id}`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        };
      },
      invalidatesTags: ["trainees"],
    }),

    login: builder.mutation({
      query: (body) => {
        return {
          url: "/auth/login",
          method: "POST",
          body: { ...body },
        };
      },
      invalidatesTags: ["profile"],
    }),

    signup: builder.mutation({
      query: (body)=>{
        return {
          url: "auth/register/applicant",
          method: "POST",
          body: {...body},
        };
      }
    }),
    verifyApplicant: builder.mutation({
      query: (userId) => {
        return {
          url: `/auth/applicant/verify?userId=${userId}`,
          method: "PATCH",
        };
      },
    }),

    resetPassword: builder.mutation({
      query: (body) => {
        return {
          url: "/auth/reset-password",
          method: "POST",
          body,
        };
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
        const { jwt, profileData } = args;
        return {
          url: "/users/my-profile",
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: { ...profileData },
        };
      },
      invalidatesTags: ["profile"],
    }),

getAllForms: builder.query({
  query: (args) => {
    const { jwt, searchString = "", cohort } = args;
    let queryString = `searchString=${searchString}`;
    if (cohort) {
      queryString += `&cohort=${cohort}`;
    }

    return {
      url: `/forms?${queryString}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    };
  },
  providesTags: ["forms"],
}),


    getForm: builder.query({
      query: (args) => {
        const { jwt, id } = args;
        return {
          url: `/forms/${id}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        };
      },
      providesTags: ["forms"],
    }),

    createForm: builder.mutation({
      query: (args) => {
        const { jwt, body } = args;
        return {
          url: "/forms",
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: { ...body },
        };
      },
      invalidatesTags: ["forms"],
    }),

    editForm: builder.mutation({
      query: (args) => {
        const { jwt, body, id } = args;
        return {
          url: `/forms/${id}`,
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: { ...body },
        };
      },
      invalidatesTags: ["forms"],
    }),

    deleteForm: builder.mutation({
      query: (args) => {
        const { jwt, id } = args;
        return {
          url: `/forms/${id}`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        };
      },
      invalidatesTags: ["forms"],
    }),

    getAllQuestionsForForm: builder.query({
      query: (args) => {
        const { jwt, formId } = args;
        return {
          url: `/questions/${formId}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        };
      },
      providesTags: ["questions"],
    }),

    createQuestion: builder.mutation({
      query: (args) => {
        const { jwt, formId, body } = args;
        return {
          url: `/questions/${formId}`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: { ...body },
        };
      },
      invalidatesTags: ["forms"],
    }),

    deleteQuestion: builder.mutation({
      query: (args) => {
        const { jwt, id } = args;
        return {
          url: `/questions/${id}`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        };
      },
      invalidatesTags: ["forms"],
    }),

    editQuestion: builder.mutation({
      query: (args) => {
        const { jwt, body, id } = args;
        return {
          url: `/questions/${id}`,
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: { ...body },
        };
      },
      invalidatesTags: ["forms"],
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
      query: ({ jwt, body, userId, questionId }) => ({
        url: `/responses/${questionId}?userId=${userId}`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body: { ...body },
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
          }
        };
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
          }
        };
      },
      providesTags: ["applicantForm"],
    }),


    addApplicantResponse: builder.mutation({
      query: ({jwt, body, action}) => ({
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
        const { jwt, body } = args;
        return {
          url: "/cohorts",
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: { ...body },
        };
      },
      invalidatesTags: ["cohorts"],
    }),
    getApplicants: builder.query({
      query: (args) => {
        const { jwt, query } = args;
        return {
          url: `/applicants${query}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        };
      },
      providesTags: ["applicants"],
    }),
    applicantDecision: builder.mutation({
      query: (args) => {
        const { jwt, body} = args;
        return {
          url: `/cohorts/decision`,
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: {...body}
        }
      },
      invalidatesTags: ["applicants"],
    }),
    getAllCohorts: builder.query({
      query: (args) => {
        const { jwt, query} = args;
        return {
          url: `/cohorts?${query}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        };
      },
      providesTags: ["cohorts"],
    })
  }),
});

export const {
  useGetAllTraineesQuery,
  useGetAllCoachesQuery,
  useCreateCoachMutation,
  useCreateTraineeMutation,
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
  useGetAllCohortsQuery,
  useGetApplicationFormQuery,
} = usersApi;
