/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"

interface WaitListSocket {
  socket: Socket | null
}

export const WaitListSocketContext = createContext<WaitListSocket>({
  socket: null,
})

export function WaitListSocketContextProvider({
  children,
}: {
  children: React.ReactNode
}): React.ReactNode {
  const [socket, setSocket] = useState<WaitListSocket>({ socket: null })

  useEffect(() => {
    const socketInstance = io("http://localhost:3000")
    socketInstance.on("connect", () => {
      console.log("--- Connected ---")
    })
    socketInstance.on("disconnect", () => console.log("--- Disconnected ---"))

    setSocket({ socket: socketInstance })

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return (
    <WaitListSocketContext.Provider value={socket}>
      {children}
    </WaitListSocketContext.Provider>
  )
}
