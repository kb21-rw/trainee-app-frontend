import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import Cookies from "universal-cookie";

const api_url = import.meta.env.VITE_API_URL;

const cookies = new Cookies()
const jwt = cookies.get("jwt")
console.log({jwt})

export  const usersApi:any = createApi({
    reducerPath: "usersApi",
    baseQuery: fetchBaseQuery({baseUrl: api_url}),
    endpoints: (builder)=>({
        getAllTrainees: builder.query({
            query: (jwt) => ({
                url: '/auth/trainees',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            }),
        }),
        getAllCoaches: builder.query({
            query: (jwt) => ({
                url: '/auth/coaches',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            }),
        })
    })
})

export const { useGetAllTraineesQuery, useGetAllCoachesQuery } = usersApi