/* eslint-disable no-console */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
import { SocketEvent } from "../types"

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
  const socketURL =
    import.meta.env.VITE_BACKEND_API_URL?.replace("/api", "") ||
    "http://localhost:3000"

  useEffect(() => {
    const socketInstance = io(socketURL, {
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
      timeout: 10000,
    })

    socketInstance.on(SocketEvent.Connect, () => {
      console.log("--- Socket Connected ---")
    })

    socketInstance.on(SocketEvent.ConnectError, (err) => {
      console.log(`--- Socket connection error: ${err} ---`)
    })

    socketInstance.on(SocketEvent.Reconnect, (attemptNumber) => {
      console.log(`--- Socket reconnected after ${attemptNumber} attempts ---`)
    })

    socketInstance.on(SocketEvent.ReconnectError, (error) => {
      console.error("--- Reconnection error:", error.message)
    })

    socketInstance.on(SocketEvent.ReconnectFailed, () => {
      console.error("--- Failed to reconnect ---")
    })

    socketInstance.io.on(SocketEvent.Error, (error) => {
      console.error("--- Socket.io error:", error)
    })

    setSocket(socketInstance)

    return () => {
      if (socketInstance) {
        socketInstance.disconnect()
        console.log("---- Socket disconnected ---")
      }
    }
  }, [socketURL])

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  )
}
