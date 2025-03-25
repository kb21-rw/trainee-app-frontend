/* eslint-disable no-console */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"

interface WaitListSocket {
  socket: Socket | null
}

export const SocketContext = createContext<WaitListSocket>({
  socket: null,
})

export function SocketContextProvider({
  children,
}: {
  children: React.ReactNode
}): React.ReactNode {
  const [socket, setSocket] = useState<Socket | null>(null)
  const socketURL = import.meta.env.VITE_API_URL

  useEffect(() => {
    const socketInstance = io(socketURL, {
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
      timeout: 10000,
    })

    socketInstance.on("connect", () => {
      console.log("--- Socket Connected ---")
    })

    socketInstance.on("connect_error", (err) => {
      console.log(`--- Socket connection error: ${err} ---`)
    })

    socketInstance.on("reconnect", (attemptNumber) => {
      console.log(`--- Socket reconnected after ${attemptNumber} attempts ---`)
    })

    socketInstance.on("reconnect_error", (error) => {
      console.error("--- Reconnection error:", error.message)
    })

    socketInstance.on("reconnect_failed", () => {
      console.error("--- Failed to reconnect ---")
    })

    socketInstance.io.on("error", (error) => {
      console.error("--- Socket.io error:", error)
    })

    setSocket(socketInstance)

    return () => {
      if (socketInstance) {
        socketInstance.disconnect()
      }
    }
  }, [socketURL])

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  )
}
