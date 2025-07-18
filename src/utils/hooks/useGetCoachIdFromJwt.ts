import { useCookies } from "react-cookie"

export const useCoachIdFromJwt = (): string | null => {
  const [cookies] = useCookies(["jwt"])
  const jwt = cookies.jwt

  if (!jwt) return null

  try {
    const payload = JSON.parse(atob(jwt.split(".")[1]))
    return (
      payload.userId ||
      payload.coachId ||
      payload.id ||
      payload.user?.id ||
      null
    )
  } catch (error) {
    console.error("Invalid JWT:", error)
    return null
  }
}
