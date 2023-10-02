import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import Cookies from "universal-cookie";

const api_url = import.meta.env.VITE_API_URL;

const cookies = new Cookies()
const jwt = cookies.get("jwt")

export  const usersApi:any = createApi({
    reducerPath: "usersApi",
    baseQuery: fetchBaseQuery({baseUrl: api_url}),
    tagTypes: ["coaches", "trainees"],
    endpoints: (builder)=>({
        getAllTrainees: builder.query({
            query: (jwt) => ({
                url: '/auth/trainees',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            }),
            providesTags: ["trainees"]
        }),
        getAllCoaches: builder.query({
            query: (jwt) => ({
                url: '/auth/coaches',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            }),
            providesTags: ["coaches"]
        }),
        createCoach: builder.mutation({
            query: (args) => {
                const {jwt, body} = args
                return ({
                url: '/auth/register',
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
                body: {...body}
            })}, 
            invalidatesTags: ["coaches"]
        }),
        createTrainee: builder.mutation({
            query: (args) => {
                const {jwt, body} = args
                return ({
                url: '/auth/register',
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
                body: {...body}
            })}, 
            invalidatesTags: ["trainees"]
        }),
        deleteCoach: builder.mutation({
            query: (args) => {
                const {jwt, id} = args
                return ({
                url: `/auth/users/${id}`,
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            })}, 
            invalidatesTags: ["coaches",]
        }),
        deleteTrainee: builder.mutation({
            query: (args) => {
                const {jwt, id} = args
                return ({
                url: `/auth/users/${id}`,
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            })}, 
            invalidatesTags: ["trainees",]
        })
    })
})

export const { useGetAllTraineesQuery, useGetAllCoachesQuery, useCreateCoachMutation, useCreateTraineeMutation, useDeleteCoachMutation, useDeleteTraineeMutation } = usersApi