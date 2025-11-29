"use client"

import React, { useMemo } from "react"
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export const Toaster = React.memo(function Toaster() {
  const { toasts } = useToast()

  const toastItems = useMemo(
    () =>
      toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      }),
    [toasts]
  )

  return (
    <ToastProvider>
      {toastItems}
      <ToastViewport />
    </ToastProvider>
  )
})
Toaster.displayName = 'Toaster'
