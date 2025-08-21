import { useSelector } from "react-redux"
import { RootState } from "../../store"

export const useUserIdFromJwt = (): string | null => {
  const cookies = useSelector((state: RootState) => state.cookies)
  const jwt = cookies.jwt

  if (!jwt) return null

  try {
    // Extracts coachId from JWT token
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
