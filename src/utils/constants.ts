export const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
export const apiUrl = import.meta.env.VITE_API_URL
export const PasswordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ //validates a password.
export const PasswordMessage =
  "Password must be 8+ characters with uppercase, lowercase, number, and special character."
