"use client"

import { useEffect, useState } from "react"
import { CheckCircle, Info, AlertCircle, TriangleAlert } from "lucide-react"

interface ToastProps {
  message: string
  type: "success" | "info" | "warning" | 'error'
  duration?: number
}

export function ShortcutToast({ message, type, duration = 2000 }: ToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  if (!visible) return null

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <TriangleAlert className="text-red-500" />
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2 duration-200">
      <div className="bg-card border border-border rounded-lg shadow-lg p-3 flex items-center gap-2 min-w-[200px]">
        {getIcon()}
        <span className="text-sm">{message}</span>
      </div>
    </div>
  )
}

export function useShortcutToast() {
  const [toast, setToast] = useState<ToastProps | null>(null)

  const showToast = (message: string, type: ToastProps["type"] = "info") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 2000)
  }

  const ToastComponent = toast ? <ShortcutToast {...toast} /> : null

  return { showToast, ToastComponent }
}
