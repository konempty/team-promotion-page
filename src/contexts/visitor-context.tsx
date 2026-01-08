import { createContext, useContext, useState, type ReactNode } from "react"
import { generateVisitorName } from "@/lib/visitor-name"

interface VisitorContextType {
  visitorName: string
}

const VisitorContext = createContext<VisitorContextType | null>(null)

export function VisitorProvider({ children }: { children: ReactNode }) {
  const [visitorName] = useState(() => generateVisitorName())

  return (
    <VisitorContext.Provider value={{ visitorName }}>
      {children}
    </VisitorContext.Provider>
  )
}

export function useVisitor() {
  const context = useContext(VisitorContext)
  if (!context) {
    throw new Error("useVisitor must be used within a VisitorProvider")
  }
  return context
}
