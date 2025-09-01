import Cookies from "js-cookie"
import { Cookie } from "./types"

type MakeRequestParams = {
  url: string
  method: string
  body?: any
  headers?: HeadersInit
}

export const makeRequest = ({
  url,
  method,
  body,
  headers,
}: MakeRequestParams) => {
  return {
    url,
    method,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    body,
  }
}

export const getAuthToken = () => Cookies.get(Cookie.token)

export const makeAuthRequest = ({
  url,
  method,
  body,
  headers,
}: MakeRequestParams) => {
  const token = getAuthToken()
  return makeRequest({
    url,
    method,
    body,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(headers || {}),
    },
  })
}
