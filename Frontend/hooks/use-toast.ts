import { useState, useEffect } from "react"

type ToastProps = {
  title?: string
  description?: string
  duration?: number
}

export function useToast() {
  const [toast, setToast] = useState<ToastProps | null>(null)

  const showToast = (props: ToastProps) => {
    setToast({ duration: 3000, ...props })
  }

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null)
      }, toast.duration)
      return () => clearTimeout(timer)
    }
  }, [toast])

  return {
    toast: showToast,
    currentToast: toast,
    dismissToast: () => setToast(null),
  }
}
