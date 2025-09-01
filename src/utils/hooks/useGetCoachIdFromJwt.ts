import { useAuth } from "./useAuth"

export const useUserIdFromJwt = (): string | null => {
  const { token } = useAuth()
  if (!token) return null
  try {
    // Extracts coachId from JWT token
    const payload = JSON.parse(atob(token.split(".")[1]))
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
